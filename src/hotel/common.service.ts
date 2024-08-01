import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { HotelsService } from './hotels.service';

@Injectable()
export class CommonService {
    constructor(
        @Inject(forwardRef(() => HotelsService))
        private readonly hotelsService: HotelsService
    ) {

    }
}