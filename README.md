# CSS Analyzer

## English

This script displays the CSS styles applied to HTML elements using console.log. It performs the following tasks:

- Parses CSS
- Calculates specificity
- Displays styles in order of specificity strength

Please note that this is a very rough implementation and the code quality is not optimized for production use.

### Features

- CSS parsing
- Specificity calculation
- Inline style consideration
- Hierarchical element analysis

### Usage

```typescript
import LabParser from './LabParser';

// Call this after component mount or user action
LabParser.parse();
```

### Example Output

For a `<span class="title">` element, the output might look like this:

```
==========Styles applied to <span class="title">:
  Selector: .second-box .title (Specificity: 0,0,2,0)
    background-color: #e4ec78
  Selector: .title (Specificity: 0,0,1,0)
    font-size: 20px
    margin-bottom: 1rem
    background-color: #f5f5f5
    padding: 10px
  Selector: span (Specificity: 0,0,0,1)
    font-weight: bold
```

## 日本語

このスクリプトは、HTMLエレメントに適用されるCSSスタイルを`console.log`を使用して表示します。主な機能は以下の通りです：

- CSSのパース
- 詳細度（specificity）の計算
- 詳細度の強さ順にスタイルを表示

注意：これは非常に粗い実装であり、コードの品質は本番使用に最適化されていません。

### 特徴

- CSSのパース
- 詳細度の計算
- インラインスタイルの考慮
- 階層的な要素分析

### 使用方法

```typescript
import LabParser from './LabParser';

// コンポーネントのマウント後やユーザーアクションに応じて呼び出す
LabParser.parse();
```

### 出力例

`<span class="title">` 要素に対する出力は以下のようになります：

```
==========Styles applied to <span class="title">:
  Selector: .second-box .title (Specificity: 0,0,2,0)
    background-color: #e4ec78
  Selector: .title (Specificity: 0,0,1,0)
    font-size: 20px
    margin-bottom: 1rem
    background-color: #f5f5f5
    padding: 10px
  Selector: span (Specificity: 0,0,0,1)
    font-weight: bold
```

この出力例は、適用されるスタイルが詳細度の高い順に表示されていることを示しています。各セレクタの詳細度も表示され、どのスタイルがどの理由で適用されているかが分かりやすくなっています。