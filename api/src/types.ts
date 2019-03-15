export type Product = {
    [index: string] : string | number
    id: string
    name: string
    slug: string
    brand: string
    price: number
    summary: string
    createdAt: number
    updatedAt: number
}

export type User = {
    id: string
    name: string
    username: string
    password: string
    admin?: boolean
    createdAt?: number
}

export type AuthPayload = {
    token: string
    user: string
}
