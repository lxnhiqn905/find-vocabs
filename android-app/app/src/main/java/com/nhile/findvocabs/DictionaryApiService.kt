package com.nhile.findvocabs

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.GET
import retrofit2.http.Path

interface DictionaryApiService {
    @GET("api/v2/entries/en/{word}")
    suspend fun lookup(@Path("word") word: String): List<DictionaryResponse>
}

object DictionaryApi {
    private val retrofit = Retrofit.Builder()
        .baseUrl("https://api.dictionaryapi.dev/")
        .addConverterFactory(GsonConverterFactory.create())
        .build()

    val service: DictionaryApiService = retrofit.create(DictionaryApiService::class.java)
}
