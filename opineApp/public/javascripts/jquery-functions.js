async function typewriteVerse(str, ele) {
    var spans = '<span>' + str.split('').join('</span><span>') + '</span>';
    $(spans).hide().appendTo('#'+ele).each(function (i) {
        $(this).delay(80 * i).css({
            display: 'inline',
            opacity: 0
        }).animate({
            opacity: 1
        }, 80);
    });
}
var str = 'Finally, brothers, whatever is true, whatever is honorable, whatever is just, whatever is pure, whatever is lovely, whatever is commendable, if there is any excellence, if there is anything worthy of praise, think about these things.';
window.addEventListener("load", typewriteVerse(str, 'graphicVerse'));