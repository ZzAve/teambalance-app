import community.flock.wirespec.compiler.core.emit.KotlinEmitter
import community.flock.wirespec.compiler.core.emit.common.PackageName
import community.flock.wirespec.compiler.core.parse.Endpoint
import community.flock.wirespec.compiler.core.parse.Endpoint.Method
import community.flock.wirespec.compiler.core.parse.Endpoint.Segment

/**
 * Custom wirespec emitter that adds Spring @XxxMapping annotations to handler functions.
 *
 * Replicates the logic from wirespec's SpringKotlinEmitter, which cannot be used directly
 * because it's final and the Gradle plugin instantiates custom emitters via no-arg constructor.
 *
 * Note: package name is hardcoded because the Gradle plugin's emitterClass instantiation
 * doesn't pass the packageName property to custom emitters.
 */
class TeamBalanceSpringKotlinEmitter :
    KotlinEmitter(PackageName("com.github.zzave.teambalance.api.interfaces.generated")) {

    override fun emitHandleFunction(endpoint: Endpoint): String {
        val path = "/" + endpoint.path.joinToString("/") { segment ->
            when (segment) {
                is Segment.Literal -> segment.value
                is Segment.Param -> "{${segment.identifier.value}}"
                else -> error("Unknown segment type: $segment")
            }
        }

        val annotation = when (endpoint.method) {
            Method.GET -> """@org.springframework.web.bind.annotation.GetMapping("$path")"""
            Method.POST -> """@org.springframework.web.bind.annotation.PostMapping("$path")"""
            Method.PUT -> """@org.springframework.web.bind.annotation.PutMapping("$path")"""
            Method.DELETE -> """@org.springframework.web.bind.annotation.DeleteMapping("$path")"""
            Method.PATCH -> """@org.springframework.web.bind.annotation.RequestMapping(value = ["$path"], method = [org.springframework.web.bind.annotation.RequestMethod.PATCH])"""
            Method.OPTIONS -> """@org.springframework.web.bind.annotation.RequestMapping(value = ["$path"], method = [org.springframework.web.bind.annotation.RequestMethod.OPTIONS])"""
            Method.HEAD -> """@org.springframework.web.bind.annotation.RequestMapping(value = ["$path"], method = [org.springframework.web.bind.annotation.RequestMethod.HEAD])"""
            Method.TRACE -> """@org.springframework.web.bind.annotation.RequestMapping(value = ["$path"], method = [org.springframework.web.bind.annotation.RequestMethod.TRACE])"""
        }

        return "$annotation\n${super.emitHandleFunction(endpoint)}"
    }
}
