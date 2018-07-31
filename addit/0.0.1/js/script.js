/* var mnt_sizeFamily = (function(option) {
  var self = this,
      proto = mnt_sizeFamily.prototype,
      
      url = window.location.href,
      ext = option.ext,
      productID =  monetateData.currentProductId, // monetate grabs the non-variant pid
      productIDNumberOnly,
      urlID = url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf(ext)),

      tallSuffix = option.tallSuffix + ext,
      regSuffix = (option.regSuffix == (''||null))? /\d\.html/ : option.regSuffix + ext,
      petiteSuffix = option.petiteSuffix + ext,

      indexTall = url.search(tallSuffix),
      indexPetite = url.search(petiteSuffix),
      indexReg = url.search(regSuffix), 
      selectable = option.selectable,
      selectedClass = option.selectedClass,
      attrLabel = option.attrLabel,
      attrValue = option.attrValue,
      listParent = option.listParent,
      newHTML = option.newHTML,
      tallButton = option.tallButton,
      regButton = option.regButton,
      petiteButton = option.petiteButton;
  
  function getIDNumber() {
    if (isNaN(productID)) { 
       // does it have a suffix?
      if (productID.endsWith(option.tallSuffix) || productID.endsWith(option.petiteSuffix) || productID.endsWith(option.regSuffix)) {
        productIDNumberOnly = productID.replace( /\D+/, ''); // get only the numbers
      }
    } else {
      productIDNumberOnly = productID;
    }
  }
  function generateURL(suffix) {
    if (suffix.constructor == RegExp) { // if regSuffix = /\d\.html/
      var newpidURL = url.replace(urlID+ext, productIDNumberOnly+ext);
    } else { 
      var newpidURL = url.replace(urlID+ext, productIDNumberOnly + suffix);
    }
    return newpidURL.substring(0, newpidURL.lastIndexOf(ext)+ext.length);
  }
  function newClickFunc(sizeButton, newURL) {
    if ($(sizeButton).hasClass(selectedClass)) {
      // don't apply click function
    } else {
      $(sizeButton).unbind();
      $(sizeButton).on('click', function(e) {
        e.preventDefault(); 
        window.location = newURL;
        // need to force to new url; replacing href value only loads the product within that element
      });
    }
  }
  function selectClass() { 
    $(attrValue).each(function(index) {
      var attrLabelHTML = $(attrLabel).html(),
          attrValHTML =  $(this).html();

      if (attrLabelHTML == attrValHTML) {
        $(this).closest(selectable).addClass(selectedClass); 
      }  
    });
  }
  function allSizingClick() {
    newClickFunc(tallButton, generateURL(tallSuffix));
    newClickFunc(regButton, generateURL(regSuffix));
    newClickFunc(petiteButton, generateURL(petiteSuffix));
  }
  function checkAjax() {
    $(document).ajaxComplete(function( event,request, settings ) {
      afterLoad();
      selectClass();
      allSizingClick();
    });
  }
  function afterLoad() {
    $(listParent).html(newHTML);
  }; 
  proto.setup = function() {
      if (indexTall>0 || indexPetite>0 || indexReg>0) {
        getIDNumber();
        checkAjax();
        selectClass();
        allSizingClick(); 
      }
  };
  return {
    setup: self.setup
  };
});
 */
$(document).ready(function() {
  /* var mntFn_sizeFamily = new mnt_sizeFamily({
    ext: '.html',
    regSuffix: '',
    tallSuffix: '-T',
    petiteSuffix: '-P', 
    tallButton: '.mntTall',
    regButton: '.mntRegular',
    petiteButton: '.mntPetite',
    selectable: 'li.selectable', // where to apply the selectedClass 
    selectedClass: 'selected',
    attrLabel: 'li.attribute.sizeFamily .attribute_label .selected-value',
    attrValue: 'ul.swatches.sizefamily li.selectable .swatchanchor',
    listParent: 'li.attribute.sizeFamily .value ul.swatches.sizefamily', // parent of size family list, selector being replaced
    newHTML: $('li.attribute.sizeFamily .value div').html() // copy the html from the monetate div
  });
  mntFn_sizeFamily.setup();
  */
  
  $('.button').click(function() {
    var currentNumber = Number($('.count').html());
    $('.count').html(currentNumber+1);
  });
  
});
