import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<{ data: unknown; statusCode: number; timestamp: string; success: boolean }> {
    return next.handle().pipe(
      map((data: unknown) => {
        const response: Response = context.switchToHttp().getResponse();
        return {
          data,
          statusCode: response.statusCode,
          timestamp: new Date().toISOString(),
          success: response.statusCode >= 200 && response.statusCode < 300,
        };
      }),
    );
  }
}
