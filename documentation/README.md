# wp-block-bucket-browser

|Selite|Arvo|
|-|-|
|Asennussijainti|  |
|Vastuuhenkilöt| Esko Lähdesmäki, Lauri Merisaari |
|Muut ympäristöt| - |
|Tuotantoympäristö| - |
|Päivitystapa||
|Jira-projekti tunnus| - |
|Riippuvuudet| - |
|Tilaaja|  |

## Kuvaus toiminnasta

Vakiopohja Wordpress lisäosan toteutukseen.
Esimerkki antaa monipuolisen pohjan Wordpress lisäosan toteutukseen.

### **Kehitystyön aloittaminen:**

1. Kopioi pohja
2. Aja ./init.sh ja anna parametriksi blockin nimi esim: ./init.sh accordion
3. Asenna komennolla `npm install`
4. Aloita kehitys komennoslla `npm start`
5. Yhdistä `/dist` -kansio Wordpressisi `plugins` -kansioon

### **Yhdistäminen Docker-Composeen**

Yhdistä tämän projektin `/dist` -kansio Dockerkontin `wp-content/plugins` -kansioon.

`docker-compose.yml` -tiedostossa tämän saat lisäämällä Wordpressin `volumes` -kohdan alle, paikallisen sijainnin ja kontin sisällä pluginin sijainnin, erottuna `:` -merkillä.

`-/wp-oman-pluginin-nimi/dist:/var/www/html/wp-content/plugins/wp-oman-pluginin-nimi`

Esimerkiksi:

      wordpress:
        volumes:
            - ../wp-block-bucket-browser/dist:/var/www/html/wp-content/plugins/block-bucket-browser

## Vikatilanteessa

Ota yhteys vastuuhenkilöihin
