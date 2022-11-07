export class UserSession {
    sessionId: number
    accessToken: string
    userId: number
    userName: string
    fullName: string
    phoneNumber: string
    email: string
    isSuperAdmin: boolean
    roles: number[]
    type: number
    subAccountId: 0
    otpRequire: boolean
    ipAddressclient: string
}

export class RolePermission {
    id: number
    featureId: number
    roleId: number
    permissionId: number
    isEnabled: boolean
    name: string
    description: string
}

export class AuthenResponse {
    data: UserSession
}