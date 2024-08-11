'use strict'

const SAVED_MEMES_KEY = 'memesDB'
const KEYWORDS_SEARCH_KEY = 'keywordsDB'
const IMGS_KEY = 'imgsDB'

let gMeme
let gSavedMemes = loadFromStorage(SAVED_MEMES_KEY) || []
/* Better to separate meme and image services and have this filter there 
   along with many other image related functions */
let gKeywordFilter = null

let gImgId = 1
let gImgs = loadFromStorage(IMGS_KEY) || _initImgs()

let gKeywordsSearchCount
_createKeywords()

function createMeme(imgId) {
    gMeme = _createMeme(imgId)
}

function _createMeme(imgId) {
    return {
        id: makeId(),
        selectedImgId: imgId,
        selectedLineIdx: 0,
        dataURL: null,
        lines: [_createLine()]
    }
}

function _createLine(txt = getTrans('textInput')) {
    return {
        id: makeId(),
        txt,
        font: 'impact',
        size: 30,
        strokeStyle: 'black',
        fillStyle: 'white',
        pos: {
            isDrag: false,
            x: 250,
            y: 30
        }
    }
}

function _initImgs() {
    return [
        { id: makeId(), url: 'images/1.jpg', keywords: ['funny', 'politics'] },
        { id: makeId(), url: 'images/2.jpg', keywords: ['cute', 'dog', 'smile'] },
        { id: makeId(), url: 'images/3.jpg', keywords: ['cute', 'baby', 'dog', 'animal'] },
        { id: makeId(), url: 'images/4.jpg', keywords: ['cute', 'cat', 'animal'] },
        { id: makeId(), url: 'images/5.jpg', keywords: ['funny', 'baby', 'smile'] },
        { id: makeId(), url: 'images/6.jpg', keywords: ['funny', 'baby'] },
        { id: makeId(), url: 'images/7.jpg', keywords: ['funny', 'baby'] },
        { id: makeId(), url: 'images/8.jpg', keywords: ['funny'] },
        { id: makeId(), url: 'images/9.jpg', keywords: ['smile', 'funny'] },
        { id: makeId(), url: 'images/10.jpg', keywords: ['funny', 'politics'] },
        { id: makeId(), url: 'images/11.jpg', keywords: ['funny'] },
        { id: makeId(), url: 'images/12.jpg', keywords: ['funny'] },
        { id: makeId(), url: 'images/13.jpg', keywords: ['funny', 'smile'] },
        { id: makeId(), url: 'images/14.jpg', keywords: ['funny'] },
        { id: makeId(), url: 'images/15.jpg', keywords: ['funny', 'politics'] },
        { id: makeId(), url: 'images/16.jpg', keywords: ['funny', 'smile'] },
        { id: makeId(), url: 'images/17.jpg', keywords: ['politics'] },
        { id: makeId(), url: 'images/18.jpg', keywords: ['funny', 'smile'] },
        { id: makeId(), url: 'images/19.jpg', keywords: ['cute', 'smile'] },
        { id: makeId(), url: 'images/20.jpg', keywords: ['funny'] },
        { id: makeId(), url: 'images/21.jpg', keywords: ['men', 'baby'] },
        { id: makeId(), url: 'images/22.jpg', keywords: ['politics'] },
        { id: makeId(), url: 'images/23.jpg', keywords: ['dog','animal','cute'] },
        { id: makeId(), url: 'images/24.jpg', keywords: ['funny'] }
    ]
}

function _saveImgs() {
    saveToStorage(IMGS_KEY, gImgs)
}

function _createKeywords() {
    gKeywordsSearchCount = loadFromStorage(KEYWORDS_SEARCH_KEY)

    if (!gKeywordsSearchCount) {
        gKeywordsSearchCount = _generateKeywords()
        _saveKeywords(KEYWORDS_SEARCH_KEY, gKeywordsSearchCount)
    }
}

function _generateKeywords() {
    const imgs = getImgs()

    const rndKeywordsCount = imgs.reduce((acc, img) => {
        const { keywords } = img
        
        keywords.forEach((keyword) => {
            if (!acc[keyword]) {
                acc[keyword] = getRandomIntInclusive(6, 24)
            }
        })

        return acc
    }, {})

    return rndKeywordsCount
}

function _saveKeywords() {
    saveToStorage(KEYWORDS_SEARCH_KEY, gKeywordsSearchCount)
}

function getKeywords() {
    return gKeywordsSearchCount
}

function getMeme() {
    return gMeme
}

function getImgs() {
    if (!gKeywordFilter) {
        return gImgs
    }

    return _filterImgs(gKeywordFilter)
}

function getImgById(imgId) {
    const imgs = getImgs()
    const img = imgs.find(img => img.id === imgId)
    return img
}

function _filterImgs(keyword) {
    const searchedKeyword = keyword.toLowerCase()
    updateKeywordsCount(searchedKeyword)
    return gImgs.filter(img => img.keywords.includes(searchedKeyword))
}

function getRandomImg() {
    const imgs = getImgs()
    const rndIdx = getRandomIntInclusive(0, imgs.length - 1)
    return imgs[rndIdx]
}

function getImdById(imgId) {
    return gImgs.find(({ id }) => imgId === id)
}

function setLineTxt(txt) {
    const line = getSelectedLine()
    line.txt = txt
}

function getSelectedLine() {
    const selectedLineIdx = gMeme.selectedLineIdx
    return gMeme.lines[selectedLineIdx]
}

function addLine(txt, height) {
    const linePosY = calcLinePos(height)

    const newLine = _createLine(txt)
    newLine.pos.y = linePosY

    gMeme.lines.push(newLine)
    gMeme.selectedLineIdx = gMeme.lines.length - 1
}

function calcLinePos(height) {
    const numOfLines = gMeme.lines.length || 0

    if (numOfLines === 0) {
        return 30
    } else if (numOfLines === 1) {
        return height - 30
    } else {
        return height / 2
    }
}

function switchLine() {
    const numOfLine = gMeme.selectedLineIdx + 1
    const numOfLines = gMeme.lines.length

    if (numOfLine >= numOfLines) {
        gMeme.selectedLineIdx = 0
    } else {
        gMeme.selectedLineIdx++
    }
}

function deleteLine() {
    const lineIdx = gMeme.selectedLineIdx
    gMeme.lines.splice(lineIdx, 1)
    gMeme.selectedLineIdx = 0
}

function increaseFontSize() {
    const line = getSelectedLine()
    if (line.size > 80) return 
    
    line.size += 2
}
 
function decreaseFontSize() {
    const line = getSelectedLine()    
    line.size = Math.max(2, line.size - 2) 
}

function setAlignTextLeft() {
    const line = getSelectedLine()
    if (line) line.align = 'left'
}

function setAlignTextCenter() {
    const line = getSelectedLine()
    if (line) line.align = 'center'
}

function setAlignTextRight() {
    const line = getSelectedLine()
    if (line) line.align = 'right'
}

function setTextAlignment(alignment, textWidth, canvasWidth) {
    const line = getSelectedLine()

    if (alignment === 'left') {
        line.pos.x = textWidth / 2
    } else if (alignment === 'center') {
        line.pos.x = canvasWidth / 2
    } else if (alignment === 'right') {
        line.pos.x = canvasWidth - textWidth / 2
    }
}

function setStrokeStyle(color) {
    const line = getSelectedLine()
    if (line) line.strokeStyle = color
}

function setFillStyle(color) {
    const line = getSelectedLine()
    if (line) line.fillStyle = color
}

function setFontFamily(font) {
    const line = getSelectedLine()
    if (line) line.font = font
}

function setLineIsDrag(line, isDrag) {
    line.isDrag = isDrag
}

function updateLinePos(dx, dy) {
    const line = getSelectedLine()
    line.pos.x += dx
    line.pos.y += dy
}

function setSelectedLineIdx(clickedLine) {
    if (!clickedLine) return

    const lineIdx = gMeme.lines.findIndex(line => line === clickedLine)
    gMeme.selectedLineIdx = lineIdx
}

function updateKeywordsCount(keyword) {
    const keywords = getKeywords()
    if (!keywords[keyword] === undefined) return
    if (!keywords[keyword] > 50) return

    keywords[keyword]++
    _saveKeywords()
}

function isLineClicked(evPos) {
    const { lines } = getMeme()

    return lines.find(({ pos, txt, size: lineHeight }) => {
        const lineWidth = gCtx.measureText(txt).width
        return evPos.x >= pos.x - lineWidth / 2 &&
               evPos.x <= pos.x + lineWidth / 2 &&
               evPos.y >= pos.y - lineHeight / 2 &&
               evPos.y <= pos.y + lineHeight / 2
    })
}

function setFilter(keyword) {
    gKeywordFilter = keyword
}

function addImg(imgSrc) {
    const newImg = _createImg(imgSrc)
    gImgs.unshift(newImg)

    _saveImgs()
}

function _createImg(url) {
    return {
        id: makeId(),
        url,
        keywords: []
    }
}

function saveMeme(dataURL) {
    const existingMeme = gSavedMemes.find(savedMeme => savedMeme.id === gMeme.id)

    if (existingMeme) {
        existingMeme.dataURL = dataURL
    } else {
        gMeme.dataURL = dataURL
        gSavedMemes.push(structuredClone(gMeme))
    }
    
    _saveMemes()
}

function _saveMemes() {
    saveToStorage(SAVED_MEMES_KEY, gSavedMemes)
}

function deleteSavedMeme(memeId) {
    const memeIdx = gSavedMemes.findIndex(({ id }) => id === memeId)
    if (memeIdx === -1) return

    gSavedMemes.splice(memeIdx, 1)
    _saveMemes()
}

function getSavedMemes() {
    return gSavedMemes
}

function setSavedMeme(meme) {
    gMeme = meme
}

function clearSelectedLine() {
    const meme = getMeme()
    meme.selectedLineIdx = null
}

function getSavedMemeById(memeId) {
    const meme = gSavedMemes.find(savedMeme => savedMeme.id === memeId)
    return meme 
}

function getSavedMemeByIdx(memeId) {
    const memeIdx = gSavedMemes.findIndex(savedMeme => savedMeme.id === memeId)
    if (memeIdx === -1) return

    return memeIdx 
}

function editSavedMeme(memeId) {
    const savedMeme = getSavedMemeById(memeId)
    gMeme = savedMeme
}

function deleteSavedMeme(memeId) {
    const memeIdx = getSavedMemeById(memeId)
    gSavedMemes.splice(memeIdx, 1)

    _saveMemes()
}