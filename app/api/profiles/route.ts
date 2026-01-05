import { NextRequest, NextResponse } from 'next/server';
import {
    getAllProfiles, getProfile, createProfile, updateProfile, renameProfile, deleteProfile, duplicateProfile
} from '@/lib/db';
import { DEFAULT_RESUME } from '@/types/resume';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (id) {
        const profile = getProfile(id);
        if (!profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }
        return NextResponse.json(profile);
    }

    const profiles = getAllProfiles();
    return NextResponse.json(profiles);
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, id, name, data } = body;

        switch (action) {
            case 'create':
                const newId = createProfile(name || 'New Profile', data || DEFAULT_RESUME);
                return NextResponse.json({ id: newId, success: true });

            case 'update':
                if (!id || !data) {
                    return NextResponse.json({ error: 'Missing id or data' }, { status: 400 });
                }
                updateProfile(id, data);
                return NextResponse.json({ success: true });

            case 'rename':
                if (!id || !name) {
                    return NextResponse.json({ error: 'Missing id or name' }, { status: 400 });
                }
                renameProfile(id, name);
                return NextResponse.json({ success: true });

            case 'delete':
                if (!id) {
                    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
                }
                deleteProfile(id);
                return NextResponse.json({ success: true });

            case 'duplicate':
                if (!id) {
                    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
                }
                const duplicatedId = duplicateProfile(id);
                if (!duplicatedId) {
                    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
                }
                return NextResponse.json({ id: duplicatedId, success: true });

            default:
                return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
