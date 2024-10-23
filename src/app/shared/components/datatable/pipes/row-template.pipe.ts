import {Pipe, PipeTransform, QueryList} from '@angular/core';
import {TableRowDirective} from '../directives/table-row.directive';

@Pipe({
  name: 'rowTemplate',
  standalone: true
})
export class RowTemplatePipe implements PipeTransform {

  transform(list: QueryList<TableRowDirective>, field: string): TableRowDirective | undefined {
    return list.find((f: TableRowDirective): boolean => f.name === field);
  }

}
