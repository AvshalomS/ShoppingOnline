import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "search"
})
export class SearchPipe implements PipeTransform {
  transform(items: any, ...args: any[]): any {
    if (!args[0]) return items;
    if (!Array.isArray(items)) return [];
    if (args[1] === "cartSearch")
      return items.filter(product => {
        return product.productName
          .toUpperCase()
          .includes(args[0].toUpperCase());
      });
    if (args[1] === "orderSearch")
      return items.map(product => {
        if (
          product.productID.productName
            .toUpperCase()
            .includes(args[0].toUpperCase())
        ) {
          if (args[0] != "") product.isSearched = true;
        } else {
          product.isSearched = false;
        }
        return product;
      });
    return [];
  }
}
