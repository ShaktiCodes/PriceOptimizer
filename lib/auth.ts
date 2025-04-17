// This is a simplified auth implementation for demo purposes
// In a real application, you would use a proper authentication system

export interface User {
  id: string
  username: string
  email?: string
  name?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

// Predefined user credentials
export const DEMO_USER = {
  username: "PriceOptimizer",
  password: "12345678",
  id: "user-1",
  name: "Price Optimizer",
  email: "demo@priceoptimizer.ai",
}

// Check if user is authenticated
export function getAuthState(): AuthState {
  if (typeof window === "undefined") {
    return { user: null, isAuthenticated: false }
  }

  const user = localStorage.getItem("auth_user")

  if (!user) {
    return { user: null, isAuthenticated: false }
  }

  try {
    const parsedUser = JSON.parse(user) as User
    return { user: parsedUser, isAuthenticated: true }
  } catch (error) {
    return { user: null, isAuthenticated: false }
  }
}

// Login user
export function login(username: string, password: string): { success: boolean; message?: string } {
  // For demo purposes, we'll check against the predefined credentials
  if (username === DEMO_USER.username && password === DEMO_USER.password) {
    const user: User = {
      id: DEMO_USER.id,
      username: DEMO_USER.username,
      name: DEMO_USER.name,
      email: DEMO_USER.email,
    }

    localStorage.setItem("auth_user", JSON.stringify(user))
    return { success: true }
  }

  return {
    success: false,
    message: "Invalid username or password. Try using PriceOptimizer/12345678",
  }
}

// Signup user
export function signup(
  username: string,
  password: string,
  email?: string,
  name?: string,
): { success: boolean; message?: string } {
  // For demo purposes, we'll check if the username is already taken
  if (username === DEMO_USER.username) {
    return {
      success: false,
      message: "Username already taken. Try using a different username or login with PriceOptimizer/12345678",
    }
  }

  // In a real app, this would create a new user in the database
  // For this demo, we'll just log in the user with the predefined credentials
  return login(DEMO_USER.username, DEMO_USER.password)
}

// Logout user
export function logout(): void {
  localStorage.removeItem("auth_user")
}
