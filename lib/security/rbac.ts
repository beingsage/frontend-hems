export type Role = "admin" | "engineer" | "user" | "viewer" | "ngo" | "security"

export type Permission =
  | "view_dashboard"
  | "view_devices"
  | "control_devices"
  | "view_analytics"
  | "manage_users"
  | "manage_settings"
  | "view_audit_logs"
  | "export_data"
  | "manage_automation"
  | "view_3d_map"
  | "manage_integrations"
  | "view_security"
  | "manage_security"
  | "view_gamification"
  | "manage_gamification"

export interface User {
  id: string
  name: string
  email: string
  role: Role
  permissions: Permission[]
  createdAt: Date
  lastLogin: Date
  status: "active" | "inactive" | "suspended"
}

const rolePermissions: Record<Role, Permission[]> = {
  admin: [
    "view_dashboard",
    "view_devices",
    "control_devices",
    "view_analytics",
    "manage_users",
    "manage_settings",
    "view_audit_logs",
    "export_data",
    "manage_automation",
    "view_3d_map",
    "manage_integrations",
    "view_security",
    "manage_security",
    "view_gamification",
    "manage_gamification"
  ],
  engineer: [
    "view_dashboard",
    "view_devices",
    "control_devices",
    "view_analytics",
    "view_audit_logs",
    "export_data",
    "manage_automation",
    "view_3d_map"
  ],
  user: ["view_dashboard", "view_devices", "control_devices", "view_analytics", "manage_automation", "view_3d_map", "view_gamification"],
  viewer: ["view_dashboard", "view_devices", "view_analytics", "view_3d_map"],
  ngo: ["view_dashboard", "view_analytics", "export_data"],
  security: ["view_dashboard", "view_security", "manage_security", "view_audit_logs"]
}

export class RBACManager {
  private users: Map<string, User> = new Map()
  private userRoles: Map<string, Role> = new Map()

  constructor() {
    this.initializeWithDemoUsers()
  }

  private initializeWithDemoUsers() {
    const adminUser: User = {
      id: "user_1",
      name: "Admin User",
      email: "admin@energy.com",
      role: "admin",
      permissions: rolePermissions["admin"],
      createdAt: new Date(),
      lastLogin: new Date(),
      status: "active"
    }
    
    const engineerUser: User = {
      id: "user_2",
      name: "Engineer User",
      email: "engineer@energy.com",
      role: "engineer",
      permissions: rolePermissions["engineer"],
      createdAt: new Date(),
      lastLogin: new Date(),
      status: "active"
    }

    this.createUser(adminUser)
    this.createUser(engineerUser)
  }

  async createUser(user: User): Promise<void> {
    this.users.set(user.id, user)
    this.userRoles.set(user.id, user.role)
  }

  async getUserRole(userId: string): Promise<Role | undefined> {
    return this.userRoles.get(userId)
  }

  async getUser(userId: string): Promise<User | undefined> {
    return this.users.get(userId)
  }

  async checkUserPermission(userId: string, requiredRoles: string[]): Promise<boolean> {
    const userRole = await this.getUserRole(userId)
    return userRole ? requiredRoles.includes(userRole) : false
  }

  async hasPermission(userId: string, permission: Permission): Promise<boolean> {
    const user = await this.getUser(userId)
    if (!user || user.status !== "active") return false
    return user.permissions.includes(permission)
  }

  async updateUserRole(userId: string, newRole: Role): Promise<boolean> {
    const user = await this.getUser(userId)
    if (!user) return false

    user.role = newRole
    user.permissions = rolePermissions[newRole]
    this.userRoles.set(userId, newRole)
    return true
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values())
  }
}

export const rbacManager = new RBACManager()