if(document.getElementsByClassName("isEnabled").checked){
    console.log('works!')
}

function disable_ext()
    {
      console.log ('111');
    }
    document.querySelector('#disable').addEventListener('click', disable_ext);