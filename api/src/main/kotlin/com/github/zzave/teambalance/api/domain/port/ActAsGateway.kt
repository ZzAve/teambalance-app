package com.github.zzave.teambalance.api.domain.port

import com.github.zzave.teambalance.api.domain.model.ActAs

/**
 * The **Act-as** state resolved for the current request — the second authorization source
 * `AuthorizationService` answers from (ADR-0023 §1, ADR-0024 §2).
 *
 * A port because the resolution happens in the request pipeline, before Spring binds anything the
 * application layer could read: infrastructure decides the grant once per request, and the
 * application reads that decision here rather than re-deriving it (two derivations of "is act-as
 * still valid" is one too many).
 *
 * SECURITY CONTRACT: [current] is non-null only under an **actively entered, unexpired** grant. It
 * must never answer from `isPlatformAdmin` alone — that would make an ordinary session silently
 * admin of whatever tenant it happened to be routed to (ADR-0024 §2).
 */
interface ActAsGateway {
    /** The grant in force for this request, or null when there is none. */
    fun current(): ActAs?

    /**
     * The act-as episode this request entered and has since lost, or null. Distinct from "never had
     * one", so the lapse can be reported as `ACT_AS_EXPIRED` rather than as a bare permission denial.
     * It authorizes nothing — it only explains a refusal, and only for the caller it names.
     */
    fun lapsed(): ActAs?
}
