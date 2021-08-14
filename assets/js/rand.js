'use strict';

export default function rand(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}