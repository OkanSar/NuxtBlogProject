export interface Comment {
    Id: number
    BlogId: number
    UserId: string
    Comment: string
    Date: string
    Status: string
    profile?:{
        email: string
        role: string
    }
    blog?:{
        id: number
        likes: number
    }
}