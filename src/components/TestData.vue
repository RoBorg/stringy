<template>
  <div>
    <span class="test"><Copy text="8950 4e47 0d0a 1a0a 0000 000d 4948 4452
0000 000a 0000 000a 0806 0000 008d 32cf
bd00 0000 0467 414d 4100 00af c837 058a
e900 0000 1974 4558 7453 6f66 7477 6172
6500 4164 6f62 6520 496d 6167 6552 6561
6479 71c9 653c 0000 0167 4944 4154 78da
2c90 3b48 1c51 1885 bf7b 6766 5d7c 63a1
ae5a 180b 9140 086a 213e 106c 042b c1c6
5641 49bb 8d8d 76a6 491b d248 40d2 2888
a585 2058 a960 a168 a128 be90 557c e26b
d575 7667 e6de 9b99 5d8b c3df 7cff 3987
23ce 26be 8dc4 9dd8 3fa7 c8c1 7244 2889
0caf b40b 0a7c c5f3 7d66 545c 4db6 1bbb
ac9a 928e 41cc c331 3ab5 8e15 fb7c 0841
6109 dc77 b023 27bb a29c f8d7 3eac 9a1f
98dc 1bc1 f62c e660 310f a99c 469a 9089
e2c4 c72d eeca 34d2 bda5 a873 1ca7 3b89
ae6e c65b fd89 9751 686d 45a0 c46e 68a1
6478 06f3 7683 dafc 8d7a 39c5 ea9d c29c
6ee3 6f2d 6144 e81a 15e7 6e97 dcdc 10e6
e904 bbff 172a f38a b7b3 10ba 8f11 b8aa
101f 15b6 abea 717a 9298 9365 f4f9 1a76
5792 8f8d 7964 651d b2ae 0de5 9b02 282b
13c8 c65e 681a c05d ff8b ac48 1064 35ea
e91a e74b 7b1e 14af 7fba 4dbc d8a0 abbe
e35d 1ee1 3da7 11b5 ad64 cf0f a134 819f
4e63 b20f c868 cc68 273f b58f 7273 61f1
18fe c51e 681f f598 ca43 ca09 46ff 0b30
0081 6599 b7e4 9326 ee00 0000 0049 454e
44ae 4260 82"/>Hex image</span>
<span class="test"><Copy text="e2988020e2988120e2988220e2988320e2988420e2988520e2988620e2988720e2988820e2988920e2988a20e2988b20e2988c20e2988d20e2988e20e2988f20e2989020e2989120e2989220e2989320e2989620e2989720e2989920e2989a20e2989b20e2989c20e2989d"/>Hex utf8</span>
<span class="test"><Copy text="-----BEGIN CERTIFICATE-----
MIII2TCCCH6gAwIBAgIQQ5v7yBGYVhFAG04E9Crs7TAKBggqhkjOPQQDAjCBkjEL
MAkGA1UEBhMCR0IxGzAZBgNVBAgTEkdyZWF0ZXIgTWFuY2hlc3RlcjEQMA4GA1UE
BxMHU2FsZm9yZDEaMBgGA1UEChMRQ09NT0RPIENBIExpbWl0ZWQxODA2BgNVBAMT
L0NPTU9ETyBFQ0MgRG9tYWluIFZhbGlkYXRpb24gU2VjdXJlIFNlcnZlciBDQSAy
MB4XDTE5MTEwNzAwMDAwMFoXDTIwMDUxNTIzNTk1OVowbDEhMB8GA1UECxMYRG9t
YWluIENvbnRyb2wgVmFsaWRhdGVkMSEwHwYDVQQLExhQb3NpdGl2ZVNTTCBNdWx0
aS1Eb21haW4xJDAiBgNVBAMTG3NuaTE1NTk4OC5jbG91ZGZsYXJlc3NsLmNvbTBZ
MBMGByqGSM49AgEGCCqGSM49AwEHA0IABJhhDApsCv3pkuoZtAvMOjoxpL69gRNg
wFYNqIkRpcER+VLs6uQFgK9ejcLP6UD/CBYYnr8guwYVhkGUYYZriXWjggbZMIIG
1TAfBgNVHSMEGDAWgBRACWFn8LyDcU/eEggsb9TUK3Y9ljAdBgNVHQ4EFgQUd9Gm
pZf35kAffTcZdlOfwls7zrkwDgYDVR0PAQH/BAQDAgeAMAwGA1UdEwEB/wQCMAAw
HQYDVR0lBBYwFAYIKwYBBQUHAwEGCCsGAQUFBwMCMEkGA1UdIARCMEAwNAYLKwYB
BAGyMQECAgcwJTAjBggrBgEFBQcCARYXaHR0cHM6Ly9zZWN0aWdvLmNvbS9DUFMw
CAYGZ4EMAQIBMFYGA1UdHwRPME0wS6BJoEeGRWh0dHA6Ly9jcmwuY29tb2RvY2E0
LmNvbS9DT01PRE9FQ0NEb21haW5WYWxpZGF0aW9uU2VjdXJlU2VydmVyQ0EyLmNy
bDCBiAYIKwYBBQUHAQEEfDB6MFEGCCsGAQUFBzAChkVodHRwOi8vY3J0LmNvbW9k
b2NhNC5jb20vQ09NT0RPRUNDRG9tYWluVmFsaWRhdGlvblNlY3VyZVNlcnZlckNB
Mi5jcnQwJQYIKwYBBQUHMAGGGWh0dHA6Ly9vY3NwLmNvbW9kb2NhNC5jb20wggQg
BgNVHREEggQXMIIEE4Ibc25pMTU1OTg4LmNsb3VkZmxhcmVzc2wuY29tghAqLmFk
aGVyZWFwcHMuY29tgg8qLmFkaGVyZWRldi5jb22CDyouYWRoZXJlZG5zLmNvbYIV
Ki5hZGhlcmV3ZWJkZXNpZ24uY29tgh8qLmJlYXV0aWZ1bGJyaWRlc21pZGxhbmRz
LmNvLnVrghEqLmNvc3Rhc21jYWZlLmNvbYIXKi5jcmltZWZpZ2h0ZXJzb2ZsYS5j
b22CDyouZWF0Y29zdGFzLmNvbYITKi5lc2lnbmF0dXJlcHJvLmNvbYIUKi5ob25l
c3Rzd2l0Y2guY28udWuCDyouamFja2Rhd2hxLmNvbYIVKi5qdXN0c2F5cGxlYXNl
LmNvLnVrghIqLmxldHN0YWxrYXV0by5jb22CFyoubGl2ZWRldmljZWNoZWNrZXIu
Y29tghIqLm1lbmRvemFmaWxtcy5jb22CFCoubmF0d2VzdGNyaWNrZXQuY29tghUq
LnByaWNlZHJvcGRvbmtleS5jb22CGSoucmVjeWNsZW15c21hcnRwaG9uZS5jb22C
Ciouc3RpY2suZWWCDyouc3RpY2tlZS5jby51a4IYKi5zdGlja2VlYnJvYWRiYW5k
LmNvLnVrghkqLnN0aWNrZWVjb21wYXJpc29uLmNvLnVrghYqLnN0aWNrZWVtb2Jp
bGVzLmNvLnVrghIqLnN0aWNrZWV2cG4uY28udWuCDyouc3VuYmlyZGhxLmNvbYIO
YWRoZXJlYXBwcy5jb22CDWFkaGVyZWRldi5jb22CDWFkaGVyZWRucy5jb22CE2Fk
aGVyZXdlYmRlc2lnbi5jb22CHWJlYXV0aWZ1bGJyaWRlc21pZGxhbmRzLmNvLnVr
gg9jb3N0YXNtY2FmZS5jb22CFWNyaW1lZmlnaHRlcnNvZmxhLmNvbYINZWF0Y29z
dGFzLmNvbYIRZXNpZ25hdHVyZXByby5jb22CEmhvbmVzdHN3aXRjaC5jby51a4IN
amFja2Rhd2hxLmNvbYITanVzdHNheXBsZWFzZS5jby51a4IQbGV0c3RhbGthdXRv
LmNvbYIVbGl2ZWRldmljZWNoZWNrZXIuY29tghBtZW5kb3phZmlsbXMuY29tghJu
YXR3ZXN0Y3JpY2tldC5jb22CE3ByaWNlZHJvcGRvbmtleS5jb22CF3JlY3ljbGVt
eXNtYXJ0cGhvbmUuY29tgghzdGljay5lZYINc3RpY2tlZS5jby51a4IWc3RpY2tl
ZWJyb2FkYmFuZC5jby51a4IXc3RpY2tlZWNvbXBhcmlzb24uY28udWuCFHN0aWNr
ZWVtb2JpbGVzLmNvLnVrghBzdGlja2VldnBuLmNvLnVrgg1zdW5iaXJkaHEuY29t
MIIBAgYKKwYBBAHWeQIEAgSB8wSB8ADuAHUAB7dcG+V9aP/xsMYdIxXHuuZXfFeU
t2ruvGE6GmnTohwAAAFuRuupNQAABAMARjBEAiBMF3/hvXr/B4yOt7ovRWnzbSX/
3bgw5YZGgdKiCnoxhQIgHraH0ECytqconxtG9qSqT8X7p0RGDiEBCNPL4wA5QH8A
dQBep3P531bA57U2SH3QSeAyepGaDIShEhKEGHWWgXFFWAAAAW5G66lEAAAEAwBG
MEQCIAYvwq8s6y4vsuNRnbOqI5wNSVzvqVWy71YZxzpCqDVPAiB/WCdYpG5CQC6x
BzjYgQwu16ng8UWlFxT+x8HhV8RGjDAKBggqhkjOPQQDAgNJADBGAiEAs/NbJnOi
W6q6fdErunKQYEMtMObm93rG5n+yhFbuJxICIQC1RJPEHKZfFKm9qp7OSv7yUzRg
CSmgD+V1NAXyXbesZg==
-----END CERTIFICATE-----"/>SSL Certificate
</span>
<span class="test"><Copy text="https://www.amazon.co.uk/dp/B07TWFWJDZ/ref=gw_uk_desk_mso_dc_avs_fb2?pf_rd_p=a2b298ad-045f-44eb-9b21-44e5da2e38ed&pf_rd_r=HZ8KBA6Y40P1CKVN6T1J#1231"/>URL</span>
<span class="test"><Copy text='{"fruit": "Apple","size": "Large","color": "Red"}'/>JSON</span>
<span class="test"><Copy text="aGVsbG8gd29ybGQ="/>Base64</span>
<span class="test"><Copy text="1576923482"/>UNIX Timestamp</span>
<span class="test"><Copy text="128.42.5.4/21"/>CIDR</span>
<span class="test"><Copy text="data:text/html;charset=utf-8,%3C!DOCTYPE%20html%3E%3Chtml%20lang%3D%22en%22%3E%3Chead%3E%3Ctitle%3EEmbedded%20Window%3C%2Ftitle%3E%3C%2Fhead%3E%3Cbody%3E%3Ch1%3E42%3C%2Fh1%3E%3C%2Fbody%3E%3C%2Fhtml%3E"/>Data URI Text</span>
<span class="test"><Copy text="data:image/png;base64,iVBORw0KGgoAAA
ANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4
//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU
5ErkJggg=="/>Data URI Image</span>
<span class="test"><Copy text="SELECT wp_woocommerce_order_items.order_id As No_Commande FROM  wp_woocommerce_order_items
LEFT JOIN     (
        SELECT meta_value As Prenom, post_id  -- <----- this
        FROM wp_postmeta         WHERE meta_key = '_shipping_first_name'
    ) AS a ON wp_woocommerce_order_items.order_id = a.post_id WHERE  wp_woocommerce_order_items.order_id =2198"/>SQL Query</span>
<span class="test"><Copy text='<?xml version="1.0" encoding="UTF-8"?><breakfast_menu>  <food>    <name>Belgian Waffles</name>    <price>$5.95</price>    <description>Two of our famous Belgian Waffles with plenty of real maple syrup</description>    <calories>650</calories>  </food>  <food>    <name>Strawberry Belgian Waffles</name>    <price>$7.95</price>    <description>Light Belgian waffles covered with strawberries and whipped cream</description>    <calories>900</calories>  </food>  <food>    <name>Berry-Berry Belgian Waffles</name>    <price>$8.95</price>    <description>Light Belgian waffles covered with an assortment of fresh berries and whipped cream</description>    <calories>900</calories>  </food>  <food>    <name>French Toast</name>    <price>$4.50</price>    <description>Thick slices made from our homemade sourdough bread</description>    <calories>600</calories>  </food>  <food>    <name>Homestyle Breakfast</name>    <price>$6.95</price>    <description>Two eggs, bacon or sausage, toast, and our ever-popular hash browns</description>    <calories>950</calories>  </food></breakfast_menu>'/>XML</span>
</div>
</template>

<script>
import Copy from './Copy';

export default {
  name: 'TestData',
  components: {
    Copy
  }
}
</script>

<style scoped>
  div {
    border: 1px solid #000000;
    margin: 10px;
  }

  .test {
    padding-right: 20px;
  }
</style>