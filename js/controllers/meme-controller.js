'use strict'

const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

let gElCanvas
let gCtx
let gDragOffset = null


function renderMeme() {
    const meme = getMeme()
    const { selectedImgId, lines } = meme
    const { url: imgSrc } = getImdById(selectedImgId)

    const elImg = new Image()
    elImg.src = imgSrc

    elImg.onload = () => {
        renderImg(elImg)
        if (!lines.length) return
        
        renderLines(lines)
        updateEditor()
    }
}

function renderImg(elImg) {
    gElCanvas.height = (elImg.naturalHeight / elImg.naturalWidth) * gElCanvas.width
    gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
}

// function renderMeme() {
//     const { selectedImgId, lines } = getMeme()
//     const { url: imgSrc } = getImdById(selectedImgId)
    
//     renderImg(imgSrc)
//     if (!lines.length) return

//     renderLines(lines)
//     updateEditor()
// }

// function renderImg(imgSrc) {
//     const elImg = new Image()
//     elImg.src = imgSrc

//     gElCanvas.height = (elImg.naturalHeight / elImg.naturalWidth) * gElCanvas.width
//     gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
// }

///////////////////////////////////////////////////

function renderLines() {
    const meme = getMeme()
    if (!meme) return
   
    const { lines, selectedLineIdx } = meme

    lines.forEach((line, idx) => {
        const { txt, font, strokeStyle, fillStyle, size, pos } = line
        
        gCtx.strokeStyle = strokeStyle
        gCtx.fillStyle = fillStyle
        gCtx.font = `${size}px ${font}`
        gCtx.textBaseline = 'middle'
        gCtx.textAlign = 'center'
        gCtx.fillText(txt, pos.x, pos.y)
        gCtx.strokeText(txt, pos.x, pos.y)

        if (idx === selectedLineIdx) {
            renderLineFrame(txt, size, pos)
        }
    })
}

function renderLineFrame(txt, size, pos) {
    const framePaddingX = 5
    const framePaddingY = 3
    
    const lineWidth = gCtx.measureText(txt).width
    const lineHeight = size
    const frameWidth = lineWidth + framePaddingX * 2
    const frameHeight = lineHeight + framePaddingY * 2
    
    gCtx.save()
    gCtx.strokeStyle = 'black'
    gCtx.lineWidth = 1.5
    gCtx.setLineDash([12, 12])

    gCtx.strokeRect(
        pos.x - lineWidth / 2 - framePaddingX,
        pos.y - lineHeight / 2 - framePaddingY,
        frameWidth,
        frameHeight
    )

    gCtx.restore()
}

function onTextInput(txt) {
    setLineTxt(txt)
    renderMeme()
}

function onAddLine(txt) {
    const canvasHeight = getCanvasDimension('height')
    addLine(txt, canvasHeight)
    clearTextInput()
    renderMeme()
}

function onSwitchLine() {
    switchLine()
    clearTextInput()
    updateTextInput()
    renderMeme()
}

function onDeleteLine() {
    if (!getSelectedLine()) return

    deleteLine()
    clearTextInput()
    updateTextInput()
    renderMeme()
}

function onUpdateFontSize(action) {
    const line = getSelectedLine()
    if (!line) return

    if (action === 'increase') {
        increaseFontSize()
    } else if (action === 'decrease') {
        decreaseFontSize()
    } 

    renderMeme()
}

function clearTextInput() {
    const elTextInput = document.querySelector('.text-input')
    elTextInput.value = ''
    // elTextInput.focus()
}

function updateTextInput() {
    let txt
    const line = getSelectedLine()
    if (!line) txt = ''
    else txt = line.txt
    
    const elTextInput = document.querySelector('.text-input')
    const elTextTransData = elTextInput.dataset.trans
    const placeholderText = getTrans(elTextTransData)

    if (txt === placeholderText) {
        elTextInput.value = ''
    } else {
        elTextInput.value = txt
    }
}

function onSetTextAlignment(alignment) {
    const line = getSelectedLine()
    if (!line) return

    const canvasWidth = getCanvasDimension('width')
    const textWidth = gCtx.measureText(line.txt).width
    setTextAlignment(alignment, textWidth, canvasWidth)

    renderMeme()
}

function onSetStrokeStyle(color) {
    setStrokeStyle(color)
    renderMeme()
}

function onSetFillStyle(color) {
    setFillStyle(color)
    renderMeme()
}

function onSetFontFamily(font) {
    setFontFamily(font)
    renderMeme()
}

function onSaveMeme() {
    onClearSelectedLine()
    const dataURL = gElCanvas.toDataURL()
    saveMeme(dataURL)
}

function onDownloadMeme(elLink) {
    onClearSelectedLine()

    const dataURL = gElCanvas.toDataURL()
    elLink.href = dataURL
}

function onClearSelectedLine() {
    clearSelectedLine()
    renderMeme()
}

function onShareOnFacebook() {
    onClearSelectedLine()

    const imgDataUrl = gElCanvas.toDataURL('image/jpeg')

    function onSuccess(uploadedImgUrl) {
        const url = encodeURIComponent(uploadedImgUrl)
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&t=${url}`)
    }
    
    doUploadImg(imgDataUrl, onSuccess)
}

function doUploadImg(imgDataUrl, onSuccess) {
    const formData = new FormData()
    formData.append('img', imgDataUrl)

    const XHR = new XMLHttpRequest()
    XHR.onreadystatechange = () => {
        if (XHR.readyState !== XMLHttpRequest.DONE) return
        if (XHR.status !== 200) return console.error('Error uploading image')
        const { responseText: url } = XHR

        console.log('Got back live url:', url)
        onSuccess(url)
    }
    XHR.onerror = (req, ev) => {
        console.error('Error connecting to server with request:', req, '\nGot response data:', ev)
    }
    XHR.open('POST', '//ca-upload.com/here/upload.php')
    XHR.send(formData)
}

function updateEditor() {
    const line = getSelectedLine()
    if (!line) return

    const { txt, font, strokeStyle, fillStyle } = line

    updateTextInput()
	
    const elFontSelect = document.getElementById('font-select')
    elFontSelect.value = font
	
    const fillColorPicker = document.querySelector('.fill-btn')
    fillColorPicker.style.boxShadow = `0px 0px 5px 3px ${fillStyle}, 
                                       inset 0px 0px 5px 3px ${fillStyle}`
    
    const strokeColorPicker = document.querySelector('.stroke-btn')
    strokeColorPicker.style.boxShadow = `0px 0px 5px 3px ${strokeStyle}, 
                                         inset 0px 0px 5px 3px ${strokeStyle}`
}

//////////////////////////////////////////////

function initCanvas() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
}

function getCanvasDimension(dimension) {
        if (dimension === 'width') {
            return gElCanvas.width
        } else if (dimension === 'height') {
            return gElCanvas.height
        } 
}

function resizeCanvas(image) {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.clientWidth
    gElCanvas.height = (image.naturalHeight / image.naturalWidth) * gElCanvas.width
}

function clearCanvas() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
}

function getCanvasCenter() {
    return {
        x: gElCanvas.width / 2,
        y: gElCanvas.height / 2
    }
}

//////////////////////////////////////////////

function initWebShareAPI() {
    const shareButton = document.querySelector(".share-btn")

    shareButton.addEventListener("click", async () => {
        onClearSelectedLine()
        const imgDataUrl = gElCanvas.toDataURL('image/jpeg')
        
        try {
            const blob = await (await fetch(imgDataUrl)).blob()
            const file = new File([blob], 'my-meme.jpg', { type: 'image/jpeg' })

            await navigator.share({
                files: [file],
                title: 'Check out my meme!',
                text: 'Created with MemeMania.'
            })
            console.log('Meme shared successfully!')
        } catch (err) {
            console.log(`Error sharing the meme: ${err.message}`)
        }
    })
}

//////////////////////////////////////////////

// Disable page-y scroll only in gallery 
// In future need to refactor with better solution
function applyScrollLockForMemeGallery() {
    const maxWidth = 780
    const memeGallery = document.querySelector('.meme-gallery')

    if (memeGallery && getComputedStyle(memeGallery).display !== 'none' && window.innerWidth <= maxWidth) {
        document.body.classList.add('no-scroll')
    } else {
        document.body.classList.remove('no-scroll')
    }
}
