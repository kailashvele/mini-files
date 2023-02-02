# Mini-Files

## Features

-   ### Image conversion from any image format into webp format

-   ### Image compression

-   ### Image quality remains same after compression

-   ### Hierarchical folder structure is also acceptable

-   ### Processed image name will remain same as raw image

## Installation

1. Clone repository on your system

```bash
git clone git@gitlab.com:tantra-gyan/mini-files.git
```

2. Enter in mini-files project

```bash
cd mini-files
```

3. Install npm

```bash
npm install
```

4. Check help

```bash
node index.js help
```

6. Run as following to see the output of demoimages directory at root

```bash
node index.js compress --inputDir demoimages --outputDir optimizedimages
```

`--outputDir optimizedimages` is optional to specify your own directory name

OR

5. Create link to the package

```bash
npm link
```

then you can run following command from the directory where your inputDir is present

```bash
minfi compress --inputDir demoimages --outputDir optimizedimages
```

`--outputDir optimizedimages` is optional to specify your own directory name
