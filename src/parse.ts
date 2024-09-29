import postcss from 'postcss';
import selectorParser from 'postcss-selector-parser';

interface Declaration {
  property: string;
  value: string;
}

interface CSSRule {
  selectors: string[];
  declarations: Declaration[];
}

interface AppliedStyle {
  selector: string;
  declarations: Declaration[];
  specificity: number[];
}

class LabParser {
  private static cssRules: CSSRule[] = [];

  private static css = `
body {
  background-color: #aaa;
}

span {
  font-weight: bold;
}

#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}


.wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  background-color: #f5f5f5;
}

.box {
  width: 300px;
  margin: 1rem;
  padding: 1rem;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.inner-box {
  width: auto;
  height: 200px;
  background-color: #ec7878;
}

.invisible-box {
  display: none;
  width: auto;
  height: 200px;
  background-color: rgb(73, 161, 73);
}

.my-box {
  width: auto;
  height: 200px;
  background-color: #7880ec;
}

.my-box > * {
  padding-bottom: 25px;
}

.title {
  font-size: 20px;
  margin-bottom: 1rem;
  background-color: #f5f5f5;
  padding: 10px;
}

.title:first-child {
  margin-right: 20px;
}

.my-box .title {
  background-color: #e4ec78;
}
  `;

  static initialize(): void {
    this.parseCSS(this.css);
  }

  private static parseCSS(css: string): void {
    const cssAst = postcss.parse(css);
    this.cssRules = cssAst.nodes
      .filter((node): node is postcss.Rule => node.type === 'rule')
      .map(rule => ({
        selectors: rule.selectors,
        declarations: rule.nodes
          .filter((node): node is postcss.Declaration => node.type === 'decl')
          .map(decl => ({
            property: decl.prop,
            value: decl.value
          }))
      }));
  }

  private static calculateSpecificity(selector: string, isInline: boolean = false): number[] {
    if (isInline) {
      return [1, 0, 0, 0]; // Inline styles have the highest specificity
    }

    let specificity: number[] = [0, 0, 0, 0];
    
    selectorParser((selectors) => {
      selectors.walk((node) => {
        if (node.type === 'id') specificity[1]++;
        else if (node.type === 'class' || node.type === 'attribute') specificity[2]++;
        else if (node.type === 'tag') specificity[3]++;
      });
    }).processSync(selector);

    return specificity;
  }

  private static matchesSelector(element: Element, selector: string): boolean {
    return element.matches(selector);
  }

  private static getAppliedStyles(element: Element): AppliedStyle[] {
    const appliedStyles: AppliedStyle[] = [];

    // Check for inline styles
    const inlineStyle = (element as HTMLElement).style;
    if (inlineStyle && inlineStyle.cssText) {
      const inlineDeclarations: Declaration[] = Array.from(inlineStyle).map(prop => ({
        property: prop,
        value: inlineStyle.getPropertyValue(prop)
      }));
      appliedStyles.push({
        selector: 'inline',
        declarations: inlineDeclarations,
        specificity: this.calculateSpecificity('', true)
      });
    }

    this.cssRules.forEach(rule => {
      rule.selectors.forEach(selector => {
        // console.log({selector});
        // console.log({element});
        if (this.matchesSelector(element, selector)) {
          const specificity = this.calculateSpecificity(selector);
          appliedStyles.push({ selector, declarations: rule.declarations, specificity });
        }
      });
    });

    // Sort by specificity
    appliedStyles.sort((a, b) => {
      for (let i = 0; i < 4; i++) {
        if (a.specificity[i] !== b.specificity[i]) {
          return b.specificity[i] - a.specificity[i];
        }
      }
      return 0;
    });

    return appliedStyles;
  }

  private static analyzeElement(element: Element): void {
    const appliedStyles = this.getAppliedStyles(element);

    if(element.className === 'title') {
      console.log(`=========Styles applied to <${element.tagName.toLowerCase()}${element.id ? ' id="' + element.id + '"' : ''}${element.className ? ' class="' + element.className + '"' : ''}>:`);
    } else {
      console.log(`Styles applied to <${element.tagName.toLowerCase()}${element.id ? ' id="' + element.id + '"' : ''}${element.className ? ' class="' + element.className + '"' : ''}>:`);
    }
    appliedStyles.forEach(style => {
      console.log(`  Selector: ${style.selector} (Specificity: ${style.specificity.join(',')})`);
      style.declarations.forEach(decl => {
        console.log(`    ${decl.property}: ${decl.value}`);
      });
    });

    // Analyze child elements
    Array.from(element.children).forEach(child => this.analyzeElement(child));
  }

  static parse(): void {
    this.initialize();
    const body = document.body;
    if (body) {
      this.analyzeElement(body);
    } else {
      console.error("No body element found in the HTML");
    }
  }
}

export default LabParser;