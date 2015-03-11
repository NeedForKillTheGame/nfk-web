<?php
if (file_exists('maps.txt')) {
    $maps = file('maps.txt', FILE_IGNORE_NEW_LINES);
} else {
    $maps = [];
}

if (isset($_GET['maptext'])) {
    $count = count($maps);
    $maps[] = rawurlencode($_GET['maptext']);
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
