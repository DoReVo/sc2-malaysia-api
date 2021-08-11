import { Params } from 'tiny-request-router'

type Handler = (request: Request) => Promise<Response>
