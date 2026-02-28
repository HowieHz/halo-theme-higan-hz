# Category Tree

## Description

用于渲染 List<[CategoryTreeVo](#categorytreevo)>。

## Usage

Content Insertion

```html
<th:block th:insert="~{components/category-tree/template :: body(categories)}"></th:block>
```

## Parameters

- `categories`: List<[CategoryTreeVo](#categorytreevo)>

## TypeDefinitions

### CategoryTreeVo

```jsonc
{
  "metadata": {
    "name": "string", // Unique identifier
    "labels": {
      "additionalProp1": "string",
    },
    "annotations": {
      "additionalProp1": "string",
    },
    "creationTimestamp": "2022-11-20T14:18:49.230Z", // Creation time
  },
  "spec": {
    "displayName": "string", // Display name
    "slug": "string", // Alias, usually used to generate status.permalink
    "description": "string", // Description
    "cover": "string", // Cover image
    "template": "string", // Custom render template name
    "priority": 0, // Sort field
    "children": [
      // Child categories, collection of category metadata.name
      "string",
    ],
  },
  "status": {
    "permalink": "string", // Permalink
  },
  "children": "List<#CategoryTreeVo>", // Child categories, collection of CategoryTreeVo
  "parentName": "string",
  "postCount": 0, // Post count
}
```
