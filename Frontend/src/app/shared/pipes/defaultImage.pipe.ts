import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'defaultImage'
})
export class DefaultImagePipe implements PipeTransform {

    transform(imageUrl: string, fallbackUrl: string = 'assets/default-user.jpg'): string {
        if (!imageUrl || imageUrl.endsWith('default.jpg')) {
            console.log(true)
          return fallbackUrl;
        }
        return imageUrl;
      }
      
}
