<?php
/**
 * Created by PhpStorm.
 * User: bernhardmostrey
 * Date: 20/05/15
 * Time: 12:51
 */

$url = $_GET["url"];

print(json_encode(get_headers($url, 1)));