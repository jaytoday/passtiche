
!function ($) {

  $(function(){

    $('.subnav').scrollspy();

    // fix sub nav on scroll
    var $win = $(window)
      , $nav = $('.subnav')
	  , navHeight = $('.navbar').first().height()
      , navTop = $('.subnav').length && $('.subnav').offset().top - navHeight
      , isFixed = 0

    processScroll()

    $win.on('scroll', processScroll)

    function processScroll() {
      var i, scrollTop = $win.scrollTop()
      if (scrollTop >= navTop && !isFixed) {
        isFixed = 1
        $nav.addClass('subnav-fixed')
      } else if (scrollTop <= navTop && isFixed) {
        isFixed = 0
        $nav.removeClass('subnav-fixed')
      }
    }

})

}(window.jQuery)





/**
 * bootbox.js v2.4.2
 *
 * http://bootboxjs.com/license.txt
 */
var bootbox=window.bootbox||function(k){function g(b,a){null==a&&(a=l);return"string"==typeof j[a][b]?j[a][b]:a!=m?g(b,m):b}var l="en",m="en",r=!0,q="static",h={},f={},j={en:{OK:"OK",CANCEL:"Cancel",CONFIRM:"OK"},fr:{OK:"OK",CANCEL:"Annuler",CONFIRM:"D'accord"},de:{OK:"OK",CANCEL:"Abbrechen",CONFIRM:"Akzeptieren"},es:{OK:"OK",CANCEL:"Cancelar",CONFIRM:"Aceptar"},br:{OK:"OK",CANCEL:"Cancelar",CONFIRM:"Sim"},nl:{OK:"OK",CANCEL:"Annuleren",CONFIRM:"Accepteren"},ru:{OK:"OK",CANCEL:"\u041e\u0442\u043c\u0435\u043d\u0430",
CONFIRM:"\u041f\u0440\u0438\u043c\u0435\u043d\u0438\u0442\u044c"},it:{OK:"OK",CANCEL:"Annulla",CONFIRM:"Conferma"}};f.setLocale=function(b){for(var a in j)if(a==b){l=b;return}throw Error("Invalid locale: "+b);};f.addLocale=function(b,a){"undefined"==typeof j[b]&&(j[b]={});for(var c in a)j[b][c]=a[c]};f.setIcons=function(b){h=b;if("object"!==typeof h||null==h)h={}};f.alert=function(){var b="",a=g("OK"),c=null;switch(arguments.length){case 1:b=arguments[0];break;case 2:b=arguments[0];"function"==typeof arguments[1]?
c=arguments[1]:a=arguments[1];break;case 3:b=arguments[0];a=arguments[1];c=arguments[2];break;default:throw Error("Incorrect number of arguments: expected 1-3");}return f.dialog(b,{label:a,icon:h.OK,callback:c},{onEscape:c})};f.confirm=function(){var b="",a=g("CANCEL"),c=g("CONFIRM"),e=null;switch(arguments.length){case 1:b=arguments[0];break;case 2:b=arguments[0];"function"==typeof arguments[1]?e=arguments[1]:a=arguments[1];break;case 3:b=arguments[0];a=arguments[1];"function"==typeof arguments[2]?
e=arguments[2]:c=arguments[2];break;case 4:b=arguments[0];a=arguments[1];c=arguments[2];e=arguments[3];break;default:throw Error("Incorrect number of arguments: expected 1-4");}return f.dialog(b,[{label:a,icon:h.CANCEL,callback:function(){"function"==typeof e&&e(!1)}},{label:c,icon:h.CONFIRM,callback:function(){"function"==typeof e&&e(!0)}}])};f.prompt=function(){var b="",a=g("CANCEL"),c=g("CONFIRM"),e=null,s="";switch(arguments.length){case 1:b=arguments[0];break;case 2:b=arguments[0];"function"==
typeof arguments[1]?e=arguments[1]:a=arguments[1];break;case 3:b=arguments[0];a=arguments[1];"function"==typeof arguments[2]?e=arguments[2]:c=arguments[2];break;case 4:b=arguments[0];a=arguments[1];c=arguments[2];e=arguments[3];break;case 5:b=arguments[0];a=arguments[1];c=arguments[2];e=arguments[3];s=arguments[4];break;default:throw Error("Incorrect number of arguments: expected 1-5");}var n=k("<form></form>");n.append("<input autocomplete=off type=text value='"+s+"' />");var d=f.dialog(n,[{label:a,
icon:h.CANCEL,callback:function(){"function"==typeof e&&e(null)}},{label:c,icon:h.CONFIRM,callback:function(){"function"==typeof e&&e(n.find("input[type=text]").val())}}],{header:b});d.on("shown",function(){n.find("input[type=text]").focus();n.on("submit",function(a){a.preventDefault();d.find(".btn-primary").click()})});return d};f.modal=function(){var b,a,c,e={onEscape:null,keyboard:!0,backdrop:q};switch(arguments.length){case 1:b=arguments[0];break;case 2:b=arguments[0];"object"==typeof arguments[1]?
c=arguments[1]:a=arguments[1];break;case 3:b=arguments[0];a=arguments[1];c=arguments[2];break;default:throw Error("Incorrect number of arguments: expected 1-3");}e.header=a;c="object"==typeof c?k.extend(e,c):e;return f.dialog(b,[],c)};f.dialog=function(b,a,c){var e=null,f="",h=[],c=c||{};null==a?a=[]:"undefined"==typeof a.length&&(a=[a]);for(var d=a.length;d--;){var g=null,j=null,l="",m=null;if("undefined"==typeof a[d].label&&"undefined"==typeof a[d]["class"]&&"undefined"==typeof a[d].callback){var g=
0,t=null,p;for(p in a[d])if(t=p,1<++g)break;1==g&&"function"==typeof a[d][p]&&(a[d].label=t,a[d].callback=a[d][p])}"function"==typeof a[d].callback&&(m=a[d].callback);a[d]["class"]?j=a[d]["class"]:d==a.length-1&&2>=a.length&&(j="btn-primary");g=a[d].label?a[d].label:"Option "+(d+1);a[d].icon&&(l="<i class='"+a[d].icon+"'></i> ");f+="<a data-handler='"+d+"' class='btn "+j+"' href='javascript:;'>"+l+""+g+"</a>";h[d]=m}a=["<div class='bootbox modal' style='overflow:hidden;'>"];if(c.header){d="";if("undefined"==
typeof c.headerCloseButton||c.headerCloseButton)d="<a href='javascript:;' class='close'>&times;</a>";a.push("<div class='modal-header'>"+d+"<h3>"+c.header+"</h3></div>")}a.push("<div class='modal-body'></div>");f&&a.push("<div class='modal-footer'>"+f+"</div>");a.push("</div>");var i=k(a.join("\n"));("undefined"===typeof c.animate?r:c.animate)&&i.addClass("fade");k(".modal-body",i).html(b);i.bind("hidden",function(){i.remove()});i.bind("hide",function(){if("escape"==e&&"function"==typeof c.onEscape)c.onEscape()});
k(document).bind("keyup.modal",function(a){27==a.which&&(e="escape")});i.bind("shown",function(){k("a.btn-primary:last",i).focus()});i.on("click",".modal-footer a, a.close",function(a){var b=k(this).data("handler"),b=h[b],c=null;"function"==typeof b&&(c=b());!1!==c&&(a.preventDefault(),e="button",i.modal("hide"))});null==c.keyboard&&(c.keyboard="function"==typeof c.onEscape);k("body").append(i);i.modal({backdrop:"undefined"===typeof c.backdrop?q:c.backdrop,keyboard:c.keyboard});return i};f.hideAll=
function(){k(".bootbox").modal("hide")};f.animate=function(b){r=b};f.backdrop=function(b){q=b};return f}(window.jQuery);