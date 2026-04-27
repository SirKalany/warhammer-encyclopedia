'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { api } from '@/lib/api'
import { UnitVariantSummaryDTO, UnitRole } from '@/lib/types'
import { useVersion } from '@/lib/VersionContext'
import UnitCard from '@/components/units/UnitCard'
import SearchBar from '@/components/common/SearchBar'
import Link from 'next/link'

const ROLES: UnitRole[] = [
    'LORDS', 'HEROES', 'MELEE_INFANTRY', 'MISSILE_INFANTRY',
    'MELEE_CAVALRY', 'MISSILE_CAVALRY', 'CHARIOTS', 'WAR_BEASTS',
    'MONSTROUS_INFANTRY', 'MONSTERS', 'WAR_MACHINES', 'ARTILLERY',
]

const ROLE_LABEL: Record<UnitRole, string> = {
    LORDS: 'Lords', HEROES: 'Heroes', MELEE_INFANTRY: 'Melee Infantry',
    MISSILE_INFANTRY: 'Missile Infantry', MELEE_CAVALRY: 'Melee Cavalry',
    MISSILE_CAVALRY: 'Missile Cavalry', CHARIOTS: 'Chariots',
    WAR_BEASTS: 'War Beasts', MONSTROUS_INFANTRY: 'Monstrous Infantry',
    MONSTERS: 'Monsters', WAR_MACHINES: 'War Machines', ARTILLERY: 'Artillery',
}

export default function UnitRosterPage() {
    const { raceSlug } = useParams<{ raceSlug: string }>()
    const { versionId } = useVersion()
    const [units, setUnits] = useState<UnitVariantSummaryDTO[]>([])
    const [raceName, setRaceName] = useState('')
    const [raceId, setRaceId] = useState<number | null>(null)
    const [search, setSearch] = useState('')
    const [selectedRole, setSelectedRole] = useState<UnitRole | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            const races = await api.raceVariants.findByVersion(versionId)
            const race = races.find(r => r.slug === raceSlug)
            if (!race) return
            setRaceName(race.name)
            setRaceId(race.id)
            const data = await api.unitVariants.findByVersion(versionId, race.id)
            setUnits(data)
            setLoading(false)
        }
        load()
    }, [raceSlug, versionId])

    const filtered = units.filter(u => {
        const matchSearch = u.name.toLowerCase().includes(search.toLowerCase())
        const matchRole = selectedRole ? u.role === selectedRole : true
        return matchSearch && matchRole
    })

    const grouped = ROLES.reduce((acc, role) => {
        const roleUnits = filtered.filter(u => u.role === role)
        if (roleUnits.length > 0) acc[role] = roleUnits
        return acc
    }, {} as Record<UnitRole, UnitVariantSummaryDTO[]>)

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm text-text-muted">
                <Link href="/units" className="hover:text-gold-bright transition-colors duration-150">Units</Link>
                <span>›</span>
                <span className="text-text-primary">{raceName}</span>
            </div>

            <h1 className="text-3xl">{raceName} Roster</h1>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                    <SearchBar placeholder="Search units..." onSearch={setSearch} />
                </div>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setSelectedRole(null)}
                        className={`font-display text-[0.65rem] tracking-widest uppercase px-3 py-1.5 rounded-sm border transition-all duration-150 ${selectedRole === null ? 'bg-gold-subtle border-gold-bright text-gold-bright' : 'bg-bg-raised border-border-gold text-text-muted hover:text-gold-bright'}`}
                    >
                        All
                    </button>
                    {ROLES.map(role => (
                        <button
                            key={role}
                            onClick={() => setSelectedRole(role === selectedRole ? null : role)}
                            className={`font-display text-[0.65rem] tracking-widest uppercase px-3 py-1.5 rounded-sm border transition-all duration-150 ${selectedRole === role ? 'bg-gold-subtle border-gold-bright text-gold-bright' : 'bg-bg-raised border-border-gold text-text-muted hover:text-gold-bright'}`}
                        >
                            {ROLE_LABEL[role]}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <p className="text-text-muted italic">Loading roster...</p>
            ) : filtered.length === 0 ? (
                <p className="text-text-muted italic">No units found.</p>
            ) : (
                <div className="space-y-8">
                    {Object.entries(grouped).map(([role, roleUnits]) => (
                        <div key={role}>
                            <h2 className="text-sm font-display tracking-widest uppercase text-text-muted mb-3 border-b border-border-subtle pb-2">
                                {ROLE_LABEL[role as UnitRole]}
                                <span className="ml-2 text-text-muted font-body normal-case tracking-normal">({roleUnits.length})</span>
                            </h2>
                            <div className="space-y-2">
                                {roleUnits.map(unit => (
                                    <UnitCard key={unit.id} unit={unit} raceSlug={raceSlug} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}