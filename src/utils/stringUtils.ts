// This file needs to be a module
// https://github.com/Microsoft/TypeScript/issues/17736#issuecomment-323073256
export {};

/// String.replaceAll()
/// from https://stackoverflow.com/a/17606289
declare global {
  interface String {
    replaceAll(search: string, replacement: string): string;
  }
}

String.prototype.replaceAll = function(search: string, replacement: string) {
  const target = this;
  return target.split(search).join(replacement);
};

/// String.capitalize()
declare global {
  interface String {
    capitalize(): string;
  }
}

if (!String.prototype.capitalize) {
  String.prototype.capitalize = function(this: string) {
    return this.replace( /(^|\s)([a-z])/g , function(m: string, p1: string, p2: string) {
      return p1 + p2.toUpperCase();
    });
  };
}

/// String.displayFormat()
declare global {
  interface String {
    displayFormat(): string;
  }
}

if (!String.prototype.displayFormat) {
  String.prototype.displayFormat = function(this: string) {
    if (this.toLowerCase().indexOf('rpkm') > -1) {
      return this.toUpperCase();
    }
    if (this.toLowerCase().indexOf('n/a') > -1) {
      return this.toUpperCase();
    }
    return this.replaceAll('_', ' ').capitalize();
  };
}
