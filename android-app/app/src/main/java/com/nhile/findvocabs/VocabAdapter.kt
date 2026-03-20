package com.nhile.findvocabs

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView

class VocabAdapter(
    private val items: List<VocabItem>,
    private val onClick: (VocabItem) -> Unit
) : RecyclerView.Adapter<VocabAdapter.VocabViewHolder>() {

    inner class VocabViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val tvWord: TextView = itemView.findViewById(R.id.tvWord)
        val tvPhonetic: TextView = itemView.findViewById(R.id.tvPhonetic)
        val tvPartOfSpeech: TextView = itemView.findViewById(R.id.tvPartOfSpeech)
        val tvDefinition: TextView = itemView.findViewById(R.id.tvDefinition)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): VocabViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_vocab, parent, false)
        return VocabViewHolder(view)
    }

    override fun onBindViewHolder(holder: VocabViewHolder, position: Int) {
        val item = items[position]
        holder.tvWord.text = item.word
        holder.tvPhonetic.text = if (item.phonetic.isNotEmpty()) item.phonetic else ""

        val firstMeaning = item.meanings.firstOrNull()
        holder.tvPartOfSpeech.text = firstMeaning?.partOfSpeech ?: ""
        holder.tvDefinition.text = firstMeaning?.definitions?.firstOrNull()?.definition ?: ""

        holder.itemView.setOnClickListener { onClick(item) }
    }

    override fun getItemCount() = items.size
}
