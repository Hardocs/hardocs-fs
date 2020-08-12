
## Mutations
### Open a folder
```gql
mutation openFolder {
  folderOpen(path:"C:/Users/jose.urra/Documents/DIVINE-TEST-SERVER"){
    name
    path
    isPackage
    hidden
    children {
      name
      path
      isPackage
      hidden
       children {
      name
      path
      isPackage
      hidden
    }
    }
  }
}
```
### Create a project
```gql
mutation createProject {
  createProject(input:{
    name:"Jose_project"
    shortTitle: "This is a test project"
    nameWithOwner: "Test project from Divine"
    longTitle: "this is a new hardocs project. Just trying to test things out"
    languages: [
  {
    name: EN
    description: "alksdlkjasldkajslkdfjalsdjclkjsalkcmakrejwoijjsdaojdsjdc",
    longDescription: "llaksdfflasdclkasdjjklaccsdlasjkjdlkjlkajsdf",
    keywords: ["new", "project"]
  }
]
    projectLink:"http://localhost:4001/"
    intendedUse: "testing",
  made: true,
  madeIndependently: true,
  license: [
    {
      name: "MIT",
      file: "LICENSE"
    }
  ],
  author: {
    name: "Divine Nature",
    affiliation: "laksdjfljakskdf"
  },
  contributors: [
    {
      name: "Juse urra Llanusa"
    },
    {
      name: "Clive (narration_sd)"
    },
    {
      name: "Santosh"
    }
  ],
  docsDir: "new",
  entryFile: "index.md",
  }){
    name
    id
    path
    shortTitle
    nameWithOwner
    longTitle
    languages{
      name
      description
      longDescription
      keywords
    }
    projectLink
    intendedUse
    intendedUse
    made
    madeIndependently
    license{
      name
      file
    }
    updatedAt
    author{
      name
      affiliation
    }
    contributors{
      name
    }
    docsDir
 
    entryFile
        allDocsMetadata {
      title
      description
      fileName
      content
      fullPath
    }
  }
}
```
## Queries
### Query a project
```gql


```