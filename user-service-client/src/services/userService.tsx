import userServiceAPI from './api';

interface RegisterUserData {
    fname: string;
    sname: string;
    email: string;
    phone: string;
    branchLocationID: number;
    dob: string;
    password: string;
}

interface LoginUserData {
    email: string;
    password: string;
}

interface UpdateUserData {
    userId: string;
    fname: string;
    sname: string;
    phone: string;
}

interface UpdatePasswordData {
    oldPassword: string;
    newPassword: string;
}

interface AdminUpdateUserData {
    adminId: string;
    targetUserId: number;
    fname: string;
    sname: string;
    phone: string;
    branchLocationID: number;
    dob: string;
    role: string;
    email: string;
}

export async function registerUser(data: RegisterUserData) {
    const response = await userServiceAPI.post('/register', data);
    return response.data;
}

export async function loginUser(data: LoginUserData) {
    const response = await userServiceAPI.post('/login', data);
    return response.data;
}

export async function verifyEmail(code: string) {
    const response = await userServiceAPI.get(`/verify-email?verificationCode=${code}`);
    return response.data;
}

export async function getUserDetails(userId: string) {
    const response = await userServiceAPI.get(`/get-user-details?userId=${userId}`);
    return response.data;
}

export async function userUpdateSelf(data: UpdateUserData) {
    const response = await userServiceAPI.patch('/user-update-self', data);
    return response.data;
}

export async function userUpdatePassword(data: UpdatePasswordData) {
    const response = await userServiceAPI.put('/update-password', data);
    return response.data;
}

export async function adminUpdateUser(data: AdminUpdateUserData) {
    const response = await userServiceAPI.patch('/admin-update-user', data);
    return response.data;
}

export async function getAllUsers(userId: string) {
    const response = await userServiceAPI.get(`/get-all-users?adminId=${userId}`);
    return response.data;
}

export async function getAllUsersPaginated(userId: string, limit: number, offset: number) {
    const response = await userServiceAPI.get(`/get-all-users-paginated?adminId=${userId}&limit=${limit}&offset=${offset}`);
    return response.data;
}
