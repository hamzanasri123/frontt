import { Pipe, PipeTransform } from '@angular/core';
import { register, format } from 'timeago.js';
import * as locale_ar from "timeago.js/lib/lang/ar";
import * as locale_fr from "timeago.js/lib/lang/fr";
import * as locale_en from "timeago.js/lib/lang/en_US";
@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if (args.length == 0) {
      return format(value as Date);
    }
    let locales = { 'fr': locale_fr.default, 'ar': locale_ar.default, 'en': locale_en.default };
    let language: string = args[0] as string;
    register(language, locales[language]);
    return format(value as Date, language);
  }

}
