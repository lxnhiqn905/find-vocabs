package com.nhile.findvocabs

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import android.widget.TextView
import com.google.android.material.bottomsheet.BottomSheetDialogFragment

class VocabDetailBottomSheet : BottomSheetDialogFragment() {

    private var vocabItem: VocabItem? = null

    companion object {
        fun newInstance(item: VocabItem): VocabDetailBottomSheet {
            return VocabDetailBottomSheet().apply { vocabItem = item }
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?
    ): View = inflater.inflate(R.layout.bottom_sheet_vocab_detail, container, false)

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        val item = vocabItem ?: return

        view.findViewById<TextView>(R.id.tvDetailWord).text = item.word
        view.findViewById<TextView>(R.id.tvDetailPhonetic).text = item.phonetic

        val meaningsContainer = view.findViewById<LinearLayout>(R.id.meaningsContainer)
        meaningsContainer.removeAllViews()

        item.meanings.forEach { meaning ->
            val posView = TextView(requireContext()).apply {
                text = meaning.partOfSpeech
                textSize = 14f
                setTextColor(resources.getColor(R.color.purple_500, null))
                setPadding(0, 24, 0, 8)
                setTypeface(null, android.graphics.Typeface.BOLD_ITALIC)
            }
            meaningsContainer.addView(posView)

            meaning.definitions.take(3).forEachIndexed { i, def ->
                val defView = TextView(requireContext()).apply {
                    text = "${i + 1}. ${def.definition}"
                    textSize = 14f
                    setPadding(0, 4, 0, 4)
                }
                meaningsContainer.addView(defView)

                def.example?.let { example ->
                    val exView = TextView(requireContext()).apply {
                        text = "\"$example\""
                        textSize = 13f
                        setTextColor(resources.getColor(android.R.color.darker_gray, null))
                        setPadding(16, 2, 0, 8)
                        setTypeface(null, android.graphics.Typeface.ITALIC)
                    }
                    meaningsContainer.addView(exView)
                }
            }
        }
    }
}
