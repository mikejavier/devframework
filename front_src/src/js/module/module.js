import $ from 'jquery'

const mymodule = () => {
    $('body').css('backgroundColor', '#000')
}

let text = `====
A soma de 2 + 2 = ${2+2}
====`

export {mymodule, text}
