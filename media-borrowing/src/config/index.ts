import 'reflect-metadata'
import { Container, Token } from 'typedi'

export const MAX_RENEWALS = new Token<number>('MAX_RENEWALS');
export const MAX_BORROWING_PERIOD_SECONDS = new Token<number>('MAX_BORROWING_PERIOD_SECONDS')

Container.set(MAX_RENEWALS, Number(process.env.MAX_RENEWALS) || 2)
Container.set(MAX_BORROWING_PERIOD_SECONDS, Number(process.env.MAX_BORROWING_PERIOD_SECONDS) || 1209600)

