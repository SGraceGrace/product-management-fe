import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SharedService } from '../shared-service/shared.service';
import { first, map } from 'rxjs';

export const guardGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const sharedService = inject(SharedService);

  return sharedService.getIsLogged().pipe(
    first(),
    map((value) => {
      const isLogged = value === 'true';
      if (isLogged) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    })
  );
      
};
