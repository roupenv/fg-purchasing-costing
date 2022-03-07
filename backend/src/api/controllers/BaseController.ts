import express from 'express';

export class BaseController {
  public async execute(req: express.Request, res: express.Response, payload: any) {
    try {
      switch (req.method) {
        case 'GET':
          {
            this.fetched(res, payload);
          }
          break;
        case 'PUT':
          {
            this.updated(res, 'Updated Successfully');
          }
          break;
        case 'POST':
          {
            this.created(res, 'Created New Resource Successfully', payload);
          }
          break;
        case 'DELETE':
          {
            this.deleted(res, 'Deleted Successfully');
          }
          break;
        default:
          break;
      }
    } catch (err) {
      console.log(`[BaseController]: Uncaught controller error`);
      console.log(err);
      this.fail(res, 'An unexpected error occurred');
    }
  }

  private fetched(res: express.Response, payload: any) {
    return res.status(200).json(payload);
  }

  private created(res: express.Response, message: string, payload: any) {
    return res.status(201).json({ message: message, newId: payload });
  }

  private updated(res: express.Response, message: string) {
    return res.status(200).json({ message: message });
  }

  private deleted(res: express.Response, message: string) {
    return res.status(200).json({ message: message });
  }
  private static jsonResponse(res: express.Response, code: number, message: string) {
    return res.status(code).json({ message });
  }

  private ok<T>(res: express.Response, dto?: T) {
    if (!!dto) {
      res.type('application/json');
      return res.status(200).json(dto);
    } else {
      return res.sendStatus(200);
    }
  }

  private clientError(res: express.Response, message?: string) {
    return BaseController.jsonResponse(res, 400, message ? message : 'Unauthorized');
  }

  private unauthorized(res: express.Response, message?: string) {
    return BaseController.jsonResponse(res, 401, message ? message : 'Unauthorized');
  }

  private paymentRequired(res: express.Response, message?: string) {
    return BaseController.jsonResponse(res, 402, message ? message : 'Payment required');
  }

  private forbidden(res: express.Response, message?: string) {
    return BaseController.jsonResponse(res, 403, message ? message : 'Forbidden');
  }

  private notFound(res: express.Response, message?: string) {
    return BaseController.jsonResponse(res, 404, message ? message : 'Not found');
  }

  private conflict(res: express.Response, message?: string) {
    return BaseController.jsonResponse(res, 409, message ? message : 'Conflict');
  }

  private tooMany(res: express.Response, message?: string) {
    return BaseController.jsonResponse(res, 429, message ? message : 'Too many requests');
  }

  private todo(res: express.Response) {
    return BaseController.jsonResponse(res, 400, 'TODO');
  }

  private fail(res: express.Response, error: Error | string) {
    console.log(error);
    return res.status(500).json({
      message: error.toString(),
    });
  }
}
