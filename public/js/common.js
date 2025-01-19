const allLikeButton = document.querySelectorAll('.like-btn')


async function likeButton(productId, btn){
    try {
        let response = await axios({
            method: 'post',
            url: `product/${productId}/like`,
            headers: {'X-Requested-With':'XMLHttpRequest'}
          });

          if(btn.children[0].classList.contains('fa-light')){
            btn.children[0].classList.remove('fa-light')
            btn.children[0].classList.add('fa-solid')
          }else{
            btn.children[0].classList.add('fa-light')
            btn.children[0].classList.remove('fa-solid')
          }

    } catch (error) {
        window.location.replace('/login')
    }
}





for (const btn of allLikeButton) {
    btn.addEventListener('click', ()=>{
        let productId = btn.getAttribute('product-id')
        likeButton(productId, btn)
    })
}