// Comprehensive Security Audit Suite for AssessmentForces
// Tests unauthenticated barriers, middleware redirects, cache control headers, and role isolation

const BASE_URL = "http://localhost:3000";

async function runSecurityTests() {
  console.log("🔒 Starting Comprehensive Security Audit Suite...\n");
  let passed = 0;
  let total = 0;

  // TEST 1: Public Problem Sandbox without authentication
  total++;
  try {
    const res = await fetch(`${BASE_URL}/candidate/assessments/seed_backend`, {
      redirect: "manual",
    });
    if (res.status === 200) {
      console.log("✅ TEST 1: Public free sandbox (/candidate/assessments/seed_backend) accessible without auth (HTTP 200)");
      passed++;
    } else {
      console.log(`❌ TEST 1: Expected HTTP 200, got ${res.status}`);
    }
  } catch (err) {
    console.log("❌ TEST 1 failed:", err.message);
  }

  // TEST 2: Protected Admin Route without cookies -> Must redirect to /login
  total++;
  try {
    const res = await fetch(`${BASE_URL}/admin`, {
      redirect: "manual",
    });
    const location = res.headers.get("location") || "";
    const cacheControl = res.headers.get("cache-control") || "";
    if (res.status === 307 || res.status === 308 || res.status === 302) {
      if (location.includes("/login") && location.includes("redirect=%2Fadmin")) {
        console.log(`✅ TEST 2: Unauthenticated /admin blocked with HTTP ${res.status} -> Redirects to ${location}`);
        passed++;
      } else {
        console.log(`❌ TEST 2: Unexpected redirect target: ${location}`);
      }
    } else {
      console.log(`❌ TEST 2: Unauthenticated /admin was NOT redirected (HTTP ${res.status})`);
    }
  } catch (err) {
    console.log("❌ TEST 2 failed:", err.message);
  }

  // TEST 3: Protected Recruiter Route without cookies -> Must redirect to /login
  total++;
  try {
    const res = await fetch(`${BASE_URL}/recruiter`, {
      redirect: "manual",
    });
    const location = res.headers.get("location") || "";
    if ((res.status === 307 || res.status === 308 || res.status === 302) && location.includes("/login")) {
      console.log(`✅ TEST 3: Unauthenticated /recruiter blocked with HTTP ${res.status} -> Redirects to ${location}`);
      passed++;
    } else {
      console.log(`❌ TEST 3: Failed to block /recruiter: status ${res.status}, loc ${location}`);
    }
  } catch (err) {
    console.log("❌ TEST 3 failed:", err.message);
  }

  // TEST 4: Protected Candidate Dashboard without cookies -> Must redirect to /login
  total++;
  try {
    const res = await fetch(`${BASE_URL}/candidate`, {
      redirect: "manual",
    });
    const location = res.headers.get("location") || "";
    if ((res.status === 307 || res.status === 308 || res.status === 302) && location.includes("/login")) {
      console.log(`✅ TEST 4: Unauthenticated /candidate blocked with HTTP ${res.status} -> Redirects to ${location}`);
      passed++;
    } else {
      console.log(`❌ TEST 4: Failed to block /candidate: status ${res.status}, loc ${location}`);
    }
  } catch (err) {
    console.log("❌ TEST 4 failed:", err.message);
  }

  // TEST 5: Cache-Control Security Headers on protected route responses
  total++;
  try {
    const res = await fetch(`${BASE_URL}/admin`, {
      redirect: "manual",
    });
    const cacheControl = res.headers.get("cache-control") || "";
    if (cacheControl.includes("no-store") || cacheControl.includes("no-cache")) {
      console.log(`✅ TEST 5: Cache-Control anti-caching header enforced: "${cacheControl}"`);
      passed++;
    } else {
      console.log(`❌ TEST 5: Missing no-store in Cache-Control: "${cacheControl}"`);
    }
  } catch (err) {
    console.log("❌ TEST 5 failed:", err.message);
  }

  // TEST 6: Candidate Cookie attempting to access Admin Route -> Redirect to Candidate
  total++;
  try {
    const res = await fetch(`${BASE_URL}/admin`, {
      headers: {
        Cookie: "devassess_token=test_cand_token; devassess_role=CANDIDATE",
      },
      redirect: "manual",
    });
    const location = res.headers.get("location") || "";
    if ((res.status === 307 || res.status === 308 || res.status === 302) && location.endsWith("/candidate")) {
      console.log(`✅ TEST 6: Role Privilege Isolation: Candidate blocked from /admin -> Redirects to ${location}`);
      passed++;
    } else {
      console.log(`❌ TEST 6: Candidate accessed /admin or wrong redirect: status ${res.status}, loc ${location}`);
    }
  } catch (err) {
    console.log("❌ TEST 6 failed:", err.message);
  }

  // TEST 7: Recruiter Cookie attempting to access Admin Route -> Redirect to Recruiter
  total++;
  try {
    const res = await fetch(`${BASE_URL}/admin`, {
      headers: {
        Cookie: "devassess_token=test_rec_token; devassess_role=RECRUITER",
      },
      redirect: "manual",
    });
    const location = res.headers.get("location") || "";
    if ((res.status === 307 || res.status === 308 || res.status === 302) && location.endsWith("/recruiter")) {
      console.log(`✅ TEST 7: Role Privilege Isolation: Recruiter blocked from /admin -> Redirects to ${location}`);
      passed++;
    } else {
      console.log(`❌ TEST 7: Recruiter accessed /admin or wrong redirect: status ${res.status}, loc ${location}`);
    }
  } catch (err) {
    console.log("❌ TEST 7 failed:", err.message);
  }

  // TEST 8: Admin Cookie accessing Admin Route -> Allowed (HTTP 200)
  total++;
  try {
    const res = await fetch(`${BASE_URL}/admin`, {
      headers: {
        Cookie: "devassess_token=test_admin_token; devassess_role=ADMIN",
      },
      redirect: "manual",
    });
    if (res.status === 200) {
      console.log(`✅ TEST 8: Verified Admin user successfully authorized for /admin (HTTP 200)`);
      passed++;
    } else {
      console.log(`❌ TEST 8: Admin failed to access /admin: status ${res.status}`);
    }
  } catch (err) {
    console.log("❌ TEST 8 failed:", err.message);
  }

  // TEST 9: Recruiter Cookie accessing Recruiter Route -> Allowed (HTTP 200)
  total++;
  try {
    const res = await fetch(`${BASE_URL}/recruiter`, {
      headers: {
        Cookie: "devassess_token=test_rec_token; devassess_role=RECRUITER",
      },
      redirect: "manual",
    });
    if (res.status === 200) {
      console.log(`✅ TEST 9: Verified Recruiter user successfully authorized for /recruiter (HTTP 200)`);
      passed++;
    } else {
      console.log(`❌ TEST 9: Recruiter failed to access /recruiter: status ${res.status}`);
    }
  } catch (err) {
    console.log("❌ TEST 9 failed:", err.message);
  }

  // TEST 10: Security Headers on public responses (nosniff, SAMEORIGIN, etc.)
  total++;
  try {
    const res = await fetch(`${BASE_URL}/`);
    const nosniff = res.headers.get("x-content-type-options");
    const frameOptions = res.headers.get("x-frame-options");
    const referrer = res.headers.get("referrer-policy");
    if (nosniff === "nosniff" && frameOptions === "SAMEORIGIN") {
      console.log(`✅ TEST 10: Global Security Headers verified: X-Content-Type-Options=${nosniff}, X-Frame-Options=${frameOptions}, Referrer-Policy=${referrer}`);
      passed++;
    } else {
      console.log(`❌ TEST 10: Missing security headers. nosniff=${nosniff}, frameOptions=${frameOptions}`);
    }
  } catch (err) {
    console.log("❌ TEST 10 failed:", err.message);
  }

  console.log(`\n========================================`);
  console.log(`🛡️ SECURITY AUDIT RESULT: ${passed}/${total} TESTS PASSED`);
  console.log(`========================================\n`);

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runSecurityTests();
