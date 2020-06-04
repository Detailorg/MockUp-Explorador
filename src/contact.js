$(function(){  

  // Check Radio-box
  var rating = '';
  var isValidRating = false;

  $(".rating input:radio").attr("checked", false);

  $('.rating input').click(function () {
      $(".rating input").removeClass('checked');
      $(this).parent().addClass('checked');
  });

  $('input:radio').change(function(){
    rating += this.value;
    isValidRating = true;
  }); 


  $('#sendValoracion').click(function(){

    isValidEmail = form_email.checkValidity()

    if (isValidEmail && isValidRating == true) {
      

      // GET/CID(NodeInfo) DESDE EL RELAY
      var keyData = "infoNodo";
      var urlGETkey = "http://51.91.78.225/records/" + keyData;

      fetch(urlGETkey, {
        method: 'GET',
        mode: 'no-cors',
        headers:{
          'Content-Type': 'application/json',
          "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlYjZmZDc2YjI1YWVlOWUxMTFmMmY0NyIsIm5hbWUiOiJWIEciLCJpYXQiOjE1ODkwNTA4MzEsImV4cCI6MTY0OTA1MDgzMX0.WXyxFXkZCxQFF9ZXU_-P7wMw2WqJ_xKVq5WSH7zoGJw`
        }
      })
      .then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(response => {
        // devuelve el CID(nodeInfo) para tomarlo después
        var cidInfoNodo = response.value;


        // POST/File JSON encryptedFile EN IPFS
        var form_email = $('#form_email').val();
        var form_message = $('#form_message').val();
        // var form_rating = $('.starRating-input').rating();

        // Monta JSON con Lugar y código, el archivo encriptado y infoNodo
        const obj = {
          email: form_email,
          message: form_message,
          rating: rating,
          infoNodo: cidInfoNodo
        };
        console.log(obj);

        // Utiliza el mismo formato que usaría un formulario si el tipo de codificación se estableciera en "multipart / form-data".
        const json = JSON.stringify(obj);
        const blob = new Blob([json], {
          type: 'application/json'
        });
        const data = new FormData();
        data.append("document", blob);

        // Variable del endpoint
        var urlPOSTfile = "http://51.91.78.225/files";

        fetch(urlPOSTfile, {
          method: 'POST',
          mode: 'no-cors',
          body: data,
          headers:{
            "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlYjZmZDc2YjI1YWVlOWUxMTFmMmY0NyIsIm5hbWUiOiJWIEciLCJpYXQiOjE1ODkwNTA4MzEsImV4cCI6MTY0OTA1MDgzMX0.WXyxFXkZCxQFF9ZXU_-P7wMw2WqJ_xKVq5WSH7zoGJw`
          }
        })
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(result => {


          // POST DE DATA: INMUTABILIZAR EN RELAY

          // KEY: será el CID resultante de publicar el JSON en IPFS
          var cidValue = Object.values(result)

          // VALUE: Tomamos el timestamp y se lo añadimos al nombre
          var d = new Date()
          var timestamp = d.getTime()

            /* -------------ESTOS DATOS DEBEN ESTAR YA CARGADOS------------ */
            // var cidNodeInfo = Qm00000000000000000
            var nLoteUser = "329"
            const nombreCooperativa = "elHenazar"
            /* -------------ESTOS DATOS DEBEN ESTAR YA CARGADOS------------ */
          
          var keyValue = nombreCooperativa + '.' + nLoteUser + '.rating.' + timestamp;
          console.log(keyValue)
          
          // Monta JSON con: data+timestamp, value: ipfs(data)
          const obj = {
            key: keyValue,
            value: cidValue[0]
          };

          const data = JSON.stringify(obj)

          // Variable del endpoint
          var urlPOST = "http://51.91.78.225/records";

          fetch(urlPOST, {
            method: 'POST',
            mode: 'no-cors',
            body: data,
            headers:{
              'Content-Type': 'application/json',
              "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlYjZmZDc2YjI1YWVlOWUxMTFmMmY0NyIsIm5hbWUiOiJWIEciLCJpYXQiOjE1ODkwNTA4MzEsImV4cCI6MTY0OTA1MDgzMX0.WXyxFXkZCxQFF9ZXU_-P7wMw2WqJ_xKVq5WSH7zoGJw`
            }
          })
          .then(res => res.json())
          .catch(error => console.error('Error:', error))
          .then(response => console.log('Success:', response))
          // POST DE DATA: INMUTABILIZAR EN RELAY

          // RESETEAR FORMULARIO "PESTAÑA DESBLOQUEAR"
          document.getElementById("contact-form").reset();
          rating = '';
          isValidRating = false;

          // MENSAJE DE AGRADECIMIENTO
          document.getElementById("ContactChange").innerHTML = "<h2 style='background-color:#149641; border-radius:30px; text-align: center; padding: 5px;'>¡Gracias por tu valoración!</h2>";

        })
        // POST/File JSON encryptedFile EN IPFS
      })
      // GET/CID(NodeInfo) DESDE EL RELAY
    }
  })
})