<?php
if (file_exists('maps.txt')) {
    $maps = file('maps.txt', FILE_IGNORE_NEW_LINES);
} else {
    $maps = [];
}

if (isset($_GET['maptext'])) {
    if (strlen($_GET['maptext']) > 10000) {
        print 'too big map';
        exit();
    }
    $newMap = rawurlencode($_GET['maptext']);
    foreach($maps as $i => $map) {
        if ($map == $newMap) {
            print $i;
            exit();
        }
    }
    $count = count($maps);
    $maps[] = $newMap;
    file_put_contents('maps.txt', implode("\n", $maps));
    print $count;
} elseif (isset($_GET['mapid'])) {
    if (isset($maps[$_GET['mapid']])) {
        header('Location: index.html?maptext=' . $maps[$_GET['mapid']]);
    } else {
        print 'unknown map id';
    }
} else {
    print 'wrong parameters';
}
