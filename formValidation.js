function Validation(formSelector){
var _this = this
var formElement = document.querySelector(formSelector);
var inputElement = formElement.querySelectorAll('[name][rules]')
var formRules = {}

var validationRules = {
    required : function(validString){
            return validString? undefined : "Trường này không được để trống"
    },
    email : function(validString){
        var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return regex.test(validString) ? undefined : 'Trường này phải là email';
    },
    min : function(min){
        return function(validString) {
            return validString.length > min ? undefined : `Trường này phải có tối thiểu ${min} ký tự`
        }
    }
}
if(formElement){
    console.log(formElement)
    inputElement.forEach(input => {
        rules = input.getAttribute('rules').split(',')
        var inputrules= []
        rules.forEach((rule)=>{
        if (rule.includes(':')){
            var ruleinfo = rule.split(':')
            inputrules.push(validationRules[ruleinfo[0]](ruleinfo[1]))
        }
        else {
            inputrules.push(validationRules[rule])
        }
        console.log(inputrules)

        })
        formRules[input.name] = inputrules
     // lắng nghe sụ kiện blur, onchange, ....
     input.onblur = handleValidate
     input.oninput = removeValidate
    });
}
function handleValidate(event){
    var rules = formRules[event.target.name]
    var errmess = undefined
    for( rule of rules){
        errmess = rule(event.target.value)
        if (errmess){
            break;
        }
    }
  // display error mess on view

        var formg = event.target.closest('.form-group')
        if(formg) {
        var formmess = formg.querySelector('.form-message')
        if(errmess){
            formmess.innerHTML = errmess
            console.log(formg.classList)
            formg.classList.add('invalid')
        }
        else {
            formmess.innerHTML = ''
            if (formg.classList.contains('invalid')){
                formg.classList.remove('invalid')
            }
        }
        }

}

function removeValidate(event) {
    var formg = event.target.closest('.form-group')
        if(formg) {
        var formmess = formg.querySelector('.form-message')
        formmess.innerHTML = ''
        if (formg.classList.contains('invalid')){
            formg.classList.remove('invalid')
        }
        }
}
formElement.onsubmit = (event)=>{
    event.preventDefault();
    isValid = true;
    for (var input of inputElement){
        if(handleValidate({target : input})){
            isValid = false;
        }
    }
    console.log(isValid)
    if (isValid) {
        // Trường hợp submit với javascript
        console.log('aaaa')
        if (typeof _this.onSubmit === 'function') {
            console.log('aaaa')
            var enableInputs = formElement.querySelectorAll('[name]');
            var formValues = Array.from(enableInputs).reduce(function (values, input) {
                
                switch(input.type) {
                    case 'radio':
                        values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                        break;
                    case 'checkbox':
                        if (!input.matches(':checked')) {
                            values[input.name] = '';
                            return values;
                        }
                        if (!Array.isArray(values[input.name])) {
                            values[input.name] = [];
                        }
                        values[input.name].push(input.value);
                        break;
                    case 'file':
                        values[input.name] = input.files;
                        break;
                    default:
                        values[input.name] = input.value;
                }

                return values;
            }, {});
            _this.onSubmit(formValues);
        }
        // Trường hợp submit với hành vi mặc định
        else {
            formElement.submit();
        }
    }




    
}
}