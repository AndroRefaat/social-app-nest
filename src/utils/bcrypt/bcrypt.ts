
import * as bcrypt from 'bcrypt';

export const hash = (plainText: string, rounds: number = Number(process.env.ROUNDS)): string => {
    return bcrypt.hashSync(plainText, rounds)
}

export const compare = (plainText: string, hash: string): boolean => {
    return bcrypt.compareSync(plainText, hash)
}