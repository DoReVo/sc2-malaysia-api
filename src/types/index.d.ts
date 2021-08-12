import { Params } from 'tiny-request-router'

type Handler = (request: Request, params: Params) => Promise<Response>
