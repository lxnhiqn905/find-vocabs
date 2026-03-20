package com.nhile.findvocabs

data class VocabItem(
    val word: String,
    val phonetic: String,
    val meanings: List<Meaning>
)
