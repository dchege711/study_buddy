declare module "markdown-it-texmath" {
  export = texmath;
}

declare function texmath(md: any, options: any): void;
declare namespace texmath {
  function mergeDelimiters(delims: any): {
    inline: any[];
    block: any[];
  };
  function inline(rule: any): (state: any, silent: any) => any;
  function block(
    rule: any,
  ): (state: any, begLine: any, endLine: any, silent: any) => any;
  function render(tex: any, displayMode: any, options: any): any;
  function use(katex: any): typeof texmath;
  let inlineRuleNames: string[];
  let blockRuleNames: string[];
  function $_pre(str: any, outerSpace: any, beg: any): boolean;
  function $_post(str: any, outerSpace: any, end: any): boolean;
  namespace rules {
    namespace brackets {
      let inline: {
        name: string;
        rex: RegExp;
        tmpl: string;
        tag: string;
      }[];
      let block: {
        name: string;
        rex: RegExp;
        tmpl: string;
        tag: string;
      }[];
    }
    namespace doxygen {
      let inline_1: {
        name: string;
        rex: RegExp;
        tmpl: string;
        tag: string;
      }[];
      export { inline_1 as inline };
      let block_1: {
        name: string;
        rex: RegExp;
        tmpl: string;
        tag: string;
      }[];
      export { block_1 as block };
    }
    namespace gitlab {
      let inline_2: {
        name: string;
        rex: RegExp;
        tmpl: string;
        tag: string;
      }[];
      export { inline_2 as inline };
      let block_2: {
        name: string;
        rex: RegExp;
        tmpl: string;
        tag: string;
      }[];
      export { block_2 as block };
    }
    namespace julia {
      let inline_3: ({
        name: string;
        rex: RegExp;
        tmpl: string;
        tag: string;
        spaceEnclosed?: undefined;
        pre?: undefined;
        post?: undefined;
      } | {
        name: string;
        rex: RegExp;
        tmpl: string;
        tag: string;
        spaceEnclosed: boolean;
        pre: (str: any, outerSpace: any, beg: any) => boolean;
        post: (str: any, outerSpace: any, end: any) => boolean;
      })[];
      export { inline_3 as inline };
      let block_3: {
        name: string;
        rex: RegExp;
        tmpl: string;
        tag: string;
      }[];
      export { block_3 as block };
    }
    namespace kramdown {
      let inline_4: {
        name: string;
        rex: RegExp;
        tmpl: string;
        tag: string;
      }[];
      export { inline_4 as inline };
      let block_4: {
        name: string;
        rex: RegExp;
        tmpl: string;
        tag: string;
      }[];
      export { block_4 as block };
    }
    namespace beg_end {
      let inline_5: any[];
      export { inline_5 as inline };
      let block_5: {
        name: string;
        rex: RegExp;
        tmpl: string;
        tag: string;
      }[];
      export { block_5 as block };
    }
    namespace dollars {
      let inline_6: ({
        name: string;
        rex: RegExp;
        tmpl: string;
        tag: string;
        displayMode: boolean;
        pre: (str: any, outerSpace: any, beg: any) => boolean;
        post: (str: any, outerSpace: any, end: any) => boolean;
        outerSpace?: undefined;
      } | {
        name: string;
        rex: RegExp;
        tmpl: string;
        tag: string;
        outerSpace: boolean;
        pre: (str: any, outerSpace: any, beg: any) => boolean;
        post: (str: any, outerSpace: any, end: any) => boolean;
        displayMode?: undefined;
      })[];
      export { inline_6 as inline };
      let block_6: {
        name: string;
        rex: RegExp;
        tmpl: string;
        tag: string;
      }[];
      export { block_6 as block };
    }
  }
}
