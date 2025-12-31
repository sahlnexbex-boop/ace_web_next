// STUDENT LOGIN
export const studentLogin = async (
  std_email: string,
  password: string
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/student/auth/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ std_email, password }),
    }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Student login failed");
  return data;
};

// STUDENT SIGNUP
export const studentSignup = async (data: {
  std_name: string;
  std_email: string;
  std_phone?: string;
  password: string;
  admission_no?: string;
  registre_no?: string;
  is_ace_std?: boolean;
}) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/student/auth/signup`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Student signup failed");
  return result;
};

// SEND OTP
export const sendStudentOtp = async (data: { std_email: string }) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/student/auth/send-otp`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to send OTP");
  return result;
};

// VERIFY OTP
export const verifyStudentOtp = async (data: {
  std_email: string;
  otp: string;
}) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/student/auth/verify-otp`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Invalid OTP");
  return result;
};

// RESET PASSWORD
export const resetStudentPassword = async (
  data: { std_email: string; newPassword: string },
  token: string
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/student/auth/reset-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to reset password");
  return result;
};

// REFRESH STUDENT ACCESS TOKEN
export const refreshStudentToken = async (refreshToken: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/student/auth/refresh-token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to refresh token");
  return data;
};

// VERIFY STUDENT TOKEN
export const verifyStudentToken = async (token: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/student/auth/verify-token`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Invalid student token");
  return data;
};
