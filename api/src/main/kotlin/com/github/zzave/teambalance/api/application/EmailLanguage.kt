package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.model.Language

/**
 * The language an email goes out in (ADR-0043 §4): the recipient's stored language, else the
 * language of the page that sent the request, else Dutch.
 */
fun emailLanguage(stored: Language?, requested: Language?): Language = stored ?: requested ?: Language.NL
