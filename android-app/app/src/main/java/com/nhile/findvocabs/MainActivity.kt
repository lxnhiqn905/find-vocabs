package com.nhile.findvocabs

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import android.view.View
import android.view.inputmethod.EditorInfo
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.nhile.findvocabs.databinding.ActivityMainBinding
import kotlinx.coroutines.launch

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private val vocabList = mutableListOf<VocabItem>()
    private lateinit var adapter: VocabAdapter

    private val speechLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == RESULT_OK) {
            val matches = result.data
                ?.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS)
            val word = matches?.firstOrNull()?.trim()?.lowercase()
            if (!word.isNullOrEmpty()) {
                binding.tvRecognized.text = word
                binding.tvRecognized.visibility = View.VISIBLE
                lookupWord(word)
            }
        }
    }

    private val micPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted ->
        if (granted) startSpeechRecognition()
        else Toast.makeText(this, "Microphone permission denied", Toast.LENGTH_SHORT).show()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        adapter = VocabAdapter(vocabList) { item ->
            VocabDetailBottomSheet.newInstance(item)
                .show(supportFragmentManager, "vocab_detail")
        }

        binding.recyclerView.apply {
            layoutManager = LinearLayoutManager(this@MainActivity)
            adapter = this@MainActivity.adapter
        }

        binding.btnSpeak.setOnClickListener {
            checkMicPermissionAndSpeak()
        }

        binding.tvTypeInstead.setOnClickListener {
            toggleInputMode()
        }

        binding.etWordInput.setOnEditorActionListener { _, actionId, _ ->
            if (actionId == EditorInfo.IME_ACTION_SEARCH) {
                val word = binding.etWordInput.text.toString().trim().lowercase()
                if (word.isNotEmpty()) {
                    binding.tvRecognized.text = word
                    binding.tvRecognized.visibility = View.VISIBLE
                    binding.etWordInput.text?.clear()
                    lookupWord(word)
                }
                true
            } else false
        }

        binding.btnSubmitWord.setOnClickListener {
            val word = binding.etWordInput.text.toString().trim().lowercase()
            if (word.isNotEmpty()) {
                binding.tvRecognized.text = word
                binding.tvRecognized.visibility = View.VISIBLE
                binding.etWordInput.text?.clear()
                lookupWord(word)
            }
        }
    }

    private fun checkMicPermissionAndSpeak() {
        when {
            ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO)
                    == PackageManager.PERMISSION_GRANTED -> startSpeechRecognition()
            else -> micPermissionLauncher.launch(Manifest.permission.RECORD_AUDIO)
        }
    }

    private fun startSpeechRecognition() {
        if (!SpeechRecognizer.isRecognitionAvailable(this)) {
            Toast.makeText(this, "Speech recognition not available", Toast.LENGTH_SHORT).show()
            return
        }
        val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
            putExtra(RecognizerIntent.EXTRA_LANGUAGE, "en-US")
            putExtra(RecognizerIntent.EXTRA_PROMPT, "Say a word...")
            putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1)
        }
        speechLauncher.launch(intent)
    }

    private fun toggleInputMode() {
        if (binding.inputContainer.visibility == View.GONE) {
            binding.inputContainer.visibility = View.VISIBLE
            binding.btnSpeak.visibility = View.GONE
            binding.tvTypeInstead.text = "Use voice instead"
        } else {
            binding.inputContainer.visibility = View.GONE
            binding.btnSpeak.visibility = View.VISIBLE
            binding.tvTypeInstead.text = "Can't speak? Type instead"
        }
    }

    private fun lookupWord(word: String) {
        binding.progressBar.visibility = View.VISIBLE
        binding.tvError.visibility = View.GONE

        lifecycleScope.launch {
            try {
                val response = DictionaryApi.service.lookup(word)
                val entry = response.firstOrNull()
                if (entry != null) {
                    val phonetic = entry.phonetic
                        ?: entry.phonetics?.firstOrNull { !it.text.isNullOrEmpty() }?.text
                        ?: ""
                    val meanings = entry.meanings ?: emptyList()

                    val existing = vocabList.indexOfFirst { it.word == word }
                    if (existing >= 0) {
                        vocabList[existing] = VocabItem(word, phonetic, meanings)
                        adapter.notifyItemChanged(existing)
                        Toast.makeText(this@MainActivity, "\"$word\" already in list, updated", Toast.LENGTH_SHORT).show()
                    } else {
                        vocabList.add(0, VocabItem(word, phonetic, meanings))
                        adapter.notifyItemInserted(0)
                        binding.recyclerView.scrollToPosition(0)
                    }

                    binding.emptyState.visibility = View.GONE
                    binding.recyclerView.visibility = View.VISIBLE
                } else {
                    showError("No definition found for \"$word\"")
                }
            } catch (e: Exception) {
                showError("Word not found: \"$word\"")
            } finally {
                binding.progressBar.visibility = View.GONE
            }
        }
    }

    private fun showError(msg: String) {
        binding.tvError.text = msg
        binding.tvError.visibility = View.VISIBLE
    }
}
